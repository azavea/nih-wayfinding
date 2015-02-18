
(function () {
    'use strict';

    /* ngInject */
    function Directions ($filter, $http, $q, $timeout, Config, MapControl, ProfileService, TurnAmenities) {

        var directionsUrl = '/otp/routers/default/plan';

        var module = {
            get: get,
            getTurnIconName: getTurnIconName,
            getRouteSummary: getRouteSummary,
            textForImage: textForImage,
            isAudited: isAudited,
            isTurn: isTurn
        };

        return module;

        /**
         * Make a routing request from origin to destination with options
         *
         * @param origin {array} [lon, lat]
         * @param destination {array} [lon, lat]
         * @param options {object}
         * // TODO: Document options object
         */
        function get(origin, destination) {
            var dfd = $q.defer();
            if (!(_.isArray(origin) && origin.length >= 2)) {
                dfd.reject({ msg: 'Invalid origin parameter' });
                return dfd.promise;
            }
            if (!(_.isArray(destination) && destination.length >= 2)) {
                dfd.reject({ msg: 'Invalid destination parameter' });
                return dfd.promise;
            }
            var otpRequestParams = getRequestParams();
            var params = angular.extend({}, otpRequestParams);

            if (params.intermediatePlaces) {
                // split request into multiple steps
                var steps = params.intermediatePlaces;
                steps.splice(0, 0, origin);
                steps.push(destination);
                var promises = [];
                for (var i = 0; i < steps.length - 1; i++) {
                    var stepOrigin = steps[i];
                    var stepDestination = steps[i + 1];
                    promises.push(makeRequest(stepOrigin, stepDestination, params));
                }
                $q.all(promises).then(function (data) {
                    var features = [];
                    angular.forEach(data, function (stepFeatureCollection) {
                        features = features.concat(stepFeatureCollection.features);
                    });
                    var geojson = {
                        type: 'FeatureCollection',
                        features: features
                    };
                    dfd.resolve(geojson);
                }, function (error) {
                    dfd.reject(error);
                });
            } else {
                makeRequest(origin, destination, params).then(function (data) {
                    dfd.resolve(data);
                }, function (error) {
                    dfd.reject(error);
                });
            }

            return dfd.promise;
        }

        function makeRequest(origin, destination, options) {
            var dfd = $q.defer();
            var params = angular.extend({}, options);
            // Swap, OTP request uses [lat,lon]
            params.fromPlace = [origin[1], origin[0]].join(',');
            params.toPlace = [destination[1], destination[0]].join(',');
            delete params.intermediatePlaces;
            $http.get(directionsUrl, {
                params: params
            }).then(function (response) {
                if (response.data.error) {
                    //  OTP returns an array indicating which fields are outside the graph bounds.
                    var missingData = response.data.error.missing;
                    if (missingData) {
                        if (missingData.length === 2) {
                            dfd.reject({
                                msg: 'Both the requested origin and destination are outside the planner bounds.'
                            });
                        } else if (missingData[0] === 'from') {
                            dfd.reject({
                                msg: 'The requested origin point is outside the planner bounds.'
                            });
                        }  else if (missingData[0] === 'to') {
                            dfd.reject({
                                msg: 'The requested destination point is outside the planner bounds.'
                            });
                        } else {
                            dfd.reject(response.data.error);
                        }
                    } else {
                        dfd.reject(response.data.error);
                    }
                } else {
                    var geojson = transformOtpToGeoJson(response.data);
                    TurnAmenities.attach(geojson);
                    dfd.resolve(geojson);
                }
            });

            return dfd.promise;
        }

        /** Build set of OpenTripPlanner request parameters based on current user preferences.
         *  Currently uses walking speed, wheelchair usage/type, steep terrain undesireability,
         *  and resting place desireability.
         *
         *  @returns {Object} set of query parameters for OpenTripPlanner directions endpoint
        */
        function getRequestParams() {
            var now = new Date();
            // This is the minimum param list (+ toPlace,fromPlace) to make a OTP plan API call
            var params = {
                mode: 'WALK',
                time: now.getHours() + ':' + now.getMinutes(),
                date: defaultDate(),
                arriveBy: false,
                wheelchair: false,
                showIntermediateStops: false
            };

            var preferences = ProfileService.getCurrentUser().preferences;

            params.walkSpeed = preferences.speed;

            params.surfaceComfort = preferences.surfaceTypeComfort;

            if (preferences.assistanceRequired) {
                if (preferences.assistanceType === 'motorized' || preferences.assistanceType === 'manual') {
                    params.wheelchair = true;
                } else {
                    // must be using walker or cane
                    params.usingWalkerCane = true;
                }
            }

            if (preferences.restFrequency > 0) {
                params.restingPlaces = true;
            }

            return params;
        }

        function getTurnIconName(turnType) {
            // TODO: Write tests once actual icons exist
            switch (turnType) {
                case 'DEPART':
                case 'CONTINUE':
                    return 'glyphicon-arrow-up';
                // Temporarily fall through to similar cases for left/right
                case 'LEFT':
                case 'SLIGHTLY_LEFT':
                case 'HARD_LEFT':
                case 'UTURN_LEFT':
                    return 'glyphicon-arrow-left';
                case 'RIGHT':
                case 'SLIGHTLY_RIGHT':
                case 'HARD_RIGHT':
                case 'UTURN_RIGHT':
                    return 'glyphicon-arrow-right';
                case 'CIRCLE_CLOCKWISE':
                case 'CIRCLE_COUNTERCLOCKWISE':
                    return 'glyphicon-repeat';
                case 'ELEVATOR':
                    return 'glyphicon-cloud-upload';
                default:
                    return 'glyphicon-remove-circle';
            }
        }

        function textForImage(imgUrl) {
            if (imgUrl.indexOf('caution') !== -1) {
                return 'Block may have issues';
            } else if (imgUrl.indexOf('flower') !== -1) {
                return 'Pretty street';
            } else if (imgUrl.indexOf('bench') !== -1) {
                return 'Has a place to rest';
            } else {
                return 'Unknown issue';
            }
            return 'Place to rest';
        }

        /**
         * Get a summary for the last requested route via Directions.get,
         *     including time, distance and # of turns
         *
         * @param  {object} geojson     Geojson returned from Directions.get
         * @param  {float} walkSpeed    Walk speed in m/s, used to calculate time, optional, default 1
         * @return {[type]}             [description]
         */
        function getRouteSummary(geojson, walkSpeed) {
            walkSpeed = walkSpeed || 1;
            var distance = 0;
            var turns = 0;
            angular.forEach(geojson.features, function (feature) {
                if (isTurn(feature.properties.directions.turn)) {
                    turns++;
                }
                distance += feature.properties.directions.distanceMeters;
            });
            return {
                distanceMeters: distance,
                timeMinutes: distance / walkSpeed / 60,
                turns: turns
            };
        }

        function isTurn(turnType) {
            var turnTypes = [
                'LEFT', 'SLIGHTLY_LEFT', 'HARD_LEFT', 'UTURN_LEFT',
                'RIGHT', 'SLIGHTLY_RIGHT', 'HARD_RIGHT', 'UTURN_RIGHT',
                'CIRCLE_CLOCKWISE', 'CIRCLE_COUNTERCLOCKWISE'
            ];
            return turnTypes.indexOf(turnType) !== -1;
        }

        /**
         * Checks the geojson response to verify that each feature was audited
         * @param  {geojson}  geojson Geojson object returned from Directions.get
         * @return {Boolean}  true if each feature has a valid lastModified property, otherwise false
         */
        function isAudited(geojson) {
            var lineStrings = _.filter(geojson.features, function (feature) {
                return feature.geometry.type === 'LineString';
            });
            var numLinestrings = lineStrings.length;
            var auditedLineStrings = 0;
            angular.forEach(lineStrings, function (lineString) {
                if (lineString.properties.lastModified) {
                    auditedLineStrings++;
                }
            });
            return auditedLineStrings === numLinestrings;
        }

        function defaultDate() {
            var now = new Date();
            var day = now.getDay();
            day = day < 10 ? '0' + day : day;
            var month = now.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            var year = now.getYear() + 1900;
            return month + '-' + day + '-' + year;
        }

        /**
         * Transform OTP response to our GeoJson stub
         * @param  {Object} otpResponse
         * @return {geojson}    NIH geojson expected response
         */
        function transformOtpToGeoJson(otpResponse) {

            var itineraries = otpResponse.plan.itineraries;
            var itinerary = itineraries[itineraries.length - 1];
            var lineStrings = [];

            angular.forEach(itinerary.legs, function (leg) {
                _.each(leg.steps, function (step) {
                    var stepPoints = L.PolylineUtil.decode(step.stepGeometry.points);
                    var invertedPoints = _.map(stepPoints, function(pt) {
                        return [pt[1], pt[0]];
                    });
                    lineStrings.push(turf.linestring(invertedPoints, propertiesFromStep(step)));
                });
            });
            return turf.featurecollection(lineStrings);

            /**
             * Transform OTP step object to NIH LineString properties.
             * Increments route summary turn count if turn found.
             *
             * @param  {object} step OTP step object
             * @return {object}     NIH properties object
             */
            function propertiesFromStep(step) {
                var distance = step.distance;
                var lastModified = (step.lastAudited || 0) / 1000;
                var turn = step.relativeDirection;
                var direction = step.absoluteDirection;
                var street = step.streetName;
                var text = turnText(turn, street, direction);
                var flags = angular.extend({}, step);
                var keys = ['distance', 'relativeDirection', 'absoluteDirection',
                            'streetName', 'lon', 'lat'];
                angular.forEach(keys, function (key) {
                    delete flags[key];
                });

                var warnings = [];
                var features = [];

                // add properties for audited edges
                if (lastModified > 0) {
                    if (step.hazards || step.crossSlope || (step.maxSlope > Config.warningMinimumGrade) ||
                        (step.surface && (step.surface !== 'Concrete'))) {
                        warnings.push('images/icons/icon-caution.svg');
                    }
                    if (step.aesthetics) {
                        features.push('images/icons/icon-flower.svg');
                    }
                    if (step.rest) {
                        features.push('images/icons/icon-bench.svg');
                    }
                }

                var properties = {
                    directions: {
                       distanceMeters: distance,
                       turn: turn,
                       text: text,
                       warnings: warnings,
                       features: features
                    },
                    flags: flags,
                    lastModified: lastModified
                };
                return properties;
            }

            function turnText(turn, street, direction) {
                var turnTextString = '';
                var turnLower = turn.toLowerCase();
                var turnSplit = turnLower.replace('_', ' ');
                street = $filter('abbreviate')(street);
                if (turn === 'DEPART') {
                    turnTextString = 'Head ' + direction.toLowerCase() + ' on ' + street;
                } else if (turn === 'CONTINUE') {
                    turnTextString = 'Continue on to ' + street;
                } else if (turn === 'ELEVATOR') {
                    turnTextString = 'Take the elevator to ' + street;
                } else if (turn.indexOf('UTURN') !== -1) {
                    turnTextString = 'Take a U-turn on to ' + street;
                } else if (turn.indexOf('LEFT') !== -1 || turn.indexOf('RIGHT') !== -1) {
                    turnTextString = 'Turn ' + turnSplit + ' on to ' + street;
                } else if (turn.indexOf('CIRCLE') !== -1) {
                    turnTextString = 'Enter the traffic circle, then exit on to ' + street;
                }
                return turnTextString;
            }
        }
    }

    angular.module('nih.routing')
    .factory('Directions', Directions);

})();
