
(function () {
    'use strict';

    /* ngInject */
    function Directions ($http, $q, $timeout, Config, MapControl, TurnAmenities) {

        var directionsUrl = Config.routing.hostname + '/otp/routers/default/plan';

        var module = {
            get: get,
            getFlagIconName: getFlagIconName,
            getTurnIconName: getTurnIconName,
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
        function get(origin, destination, options) {
            var dfd = $q.defer();
            if (!(_.isArray(origin) && origin.length >= 2)) {
                dfd.reject({ msg: 'Invalid origin parameter' });
                return dfd.promise;
            }
            if (!(_.isArray(destination) && destination.length >= 2)) {
                dfd.reject({ msg: 'Invalid destination parameter' });
                return dfd.promise;
            }
            var now = new Date();
            // This is the minimum param list (+ toPlace,fromPlace) to make a OTP plan API call
            var defaults = {
                mode: 'WALK',
                time: now.getHours() + ':' + now.getMinutes(),
                date: defaultDate(),
                arriveBy: false,
                wheelchair: false,
                showIntermediateStops: false
            };
            var params = angular.extend({}, defaults, options);
            // Swap, OTP request uses [lat,lon]
            params.fromPlace = [origin[1], origin[0]].join(',');
            params.toPlace = [destination[1], destination[0]].join(',');

            $http.get(directionsUrl, {
                params: params
            }).then(function (response) {
                if (response.data.error) {
                    dfd.reject(response.data.error);
                } else {
                    var geojson = transformOtpToGeoJson(response.data);
                    TurnAmenities.attach(geojson);
                    dfd.resolve(geojson);
                }
            });
            return dfd.promise;
        }

        function getFlagIconName(flagType, value) {
            // TODO: Write tests once actual icons exist
            if (!value) {
                return '';
            }

            switch (flagType) {
                case 'benches':
                    return 'glyphicon-flash';
                case 'hazards':
                    return 'glyphicon-warning-sign';
                case 'bathrooms':
                    return 'glyphicon-trash';
                default:
                    return '';
            }
        }

        function getTurnIconName(turnType) {
            // TODO: Write tests once actual icons exist
            switch (turnType) {
                case 'DEPART':
                    return 'glyphicon-flag';
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
            var itinerary = itineraries[0];
            var lineStrings = [];

            // Foreach leg in legs
            angular.forEach(itinerary.legs, function (leg) {
                // get steps as points
                var steps = _.map(leg.steps, function (step) {
                    return stepToPoint(step);
                });
                var numSteps = steps.length;

                // Get legGeometry as feature collection of points
                var legPoints = L.PolylineUtil.decode(leg.legGeometry.points);
                var stepCollection = turf.featurecollection(_.map(legPoints, function (point) {
                    return turf.point([point[1], point[0]]);
                }));

                // Loop each of the legGeometry points, and add them to the previous step until we hit
                //      a legGeometry point that is nearest to the next step. At that point, save off
                //      the existing line points to the first step LineString and attach properties to it.
                var currentStep = 1;
                var stepLinePoints = [MapControl.pointToLngLat(stepCollection.features[0])];
                var numFeatures = stepCollection.features.length;
                for (var i = 0; i < numFeatures; i++) {
                    var feature = stepCollection.features[i];
                    var lngLatPoint = MapControl.pointToLngLat(feature);
                    if (currentStep < numSteps && feature === turf.nearest(steps[currentStep], stepCollection) ||
                        i === numFeatures - 1) {
                        var lastStepPoint = steps[currentStep - 1];
                        var lastStepProperties = propertiesFromStep(lastStepPoint);
                        stepLinePoints.push(lngLatPoint);
                        lineStrings.push(turf.linestring(stepLinePoints, lastStepProperties));
                        stepLinePoints = [];
                        currentStep++;
                    }
                    stepLinePoints.push(lngLatPoint);
                }
            });
            return turf.featurecollection(lineStrings);

            /**
             * Transform OTP step object properties to NIH LineString properties
             * @param  {object} step OTP step object
             * @return {object}     NIH properties object
             */
            function propertiesFromStep(step) {
                var distance = step.properties.distance;
                var turn = step.properties.relativeDirection;
                var direction = step.properties.absoluteDirection;
                var street = step.properties.streetName;
                var text = turnText(turn, street, direction);
                var flags = angular.extend({}, step.properties);
                var keys = ['distance', 'relativeDirection', 'absoluteDirection',
                            'streetName', 'lon', 'lat'];
                angular.forEach(keys, function (key) {
                    delete flags[key];
                });
                var properties = {
                    directions: {
                       distanceMeters: distance,
                       turn: turn,
                       text: text
                    },
                    flags: flags,
                    lastUpdated: 0
                };
                return properties;
            }

            /**
             * Transform OTP step object to GeoJson Point, with properties
             * @param  {object} step
             * @return {Point}
             */
            function stepToPoint(step) {
                var lat = step.lat;
                var lon = step.lon;
                var properties = angular.extend({}, step);
                delete properties.lat;
                delete properties.lon;
                return turf.point([lon, lat], properties);
            }

            function turnText(turn, street, direction) {
                var turnTextString = '';
                var turnLower = turn.toLowerCase();
                var turnSplit = turnLower.replace('_', ' ');
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
