
(function () {
    'use strict';

    /* ngInject */
    function Navigation (
        $q, $interval, $rootScope, $timeout,
        $geolocation,
        Config
    ) {

        var events = {
            positionUpdated: 'nih.navigation.positionUpdated'
        };
        var position = {
            point: null,
            properties: null,
            destination: null
        };
        var stepLengthFeet = Config.stepLengthFeet || 100;
        var stepLengthMiles = stepLengthFeet / 5280;
        var currentRoute = {
            stepBoxes: [],
            geom: null, // linestring
            distance: 0,
            stepped: 0
        };

        var module = {
            getCurrentPosition: getCurrentPosition,
            setRoute: setRoute,
            stepNext: stepNext,
            stepPrevious: stepPrevious,
            stepFirst: stepFirst,
            stepLast: stepLast
        };

        return module;

        /**
         * getCurrentPosition wrapper for geolocation operations
         * This function signature should match $geolocation.getCurrentPosition
         *
         * Currently stubbed with mock location configured in config.js, returns private position
         * object if set, otherwise the Config.stubs.geolocation
         *
         * @return {promise} Resolve with Geolocation object or reject with messages
         */
        function getCurrentPosition() {
            // Could replace this with a call to $geolocation and pass through the promises
            var latitude = position.latitude || Config.stubs.geolocation.latitude;
            var longitude = position.longitude || Config.stubs.geolocation.longitude;
            var geolocation = {
                coords: {
                    latitude: latitude,
                    longitude: longitude
                }
            };
            var dfd = $q.defer();
            $timeout(function () {
                dfd.resolve(geolocation);
            }, 100);
            return dfd.promise;
        }

        /**
         * Set navigation route to a geojson object returned by Directions.get
         * @param {FeatureCollection} newRoute Feature collection of linestrings with directions properties
         */
        function setRoute(geojsonRoute) {
            var coordinates = _(geojsonRoute.features)
                .map(function (feature) { return feature.geometry.coordinates; })
                .flatten(true)
                .value();

            currentRoute.stepBoxes = generateStepBoxes(geojsonRoute);
            // Flatten the original FeatureCollection linestring to a single linestring
            //  so we can properly step along it
            currentRoute.geom = turf.linestring(coordinates);
            currentRoute.distance = turf.lineDistance(currentRoute.geom, 'miles');
            currentRoute.stepped = 0;
        }

        function stepNext() {
            currentRoute.stepped += stepLengthMiles;
            setPosition(currentRoute.stepped);
        }

        function stepPrevious() {
            currentRoute.stepped -= stepLengthMiles;
            setPosition(currentRoute.stepped);
        }

        function stepFirst() {
            setPosition(0);
        }

        function stepLast() {
            setPosition(currentRoute.distance);
        }

        function setPosition(distance) {
            if (distance > currentRoute.distance) {
                distance = currentRoute.distance;
                currentRoute.stepped = currentRoute.distance;
            }
            if (distance < 0) {
                distance = 0;
                currentRoute.stepped = 0;
            }
            if (routeExists()) {
                var point = along(currentRoute.geom, distance, 'miles');
                var stepBox = findStepBoxForPoint(point);
                // Pass all relevant position info
                //  point, properties, next destination point
                position.point = point;
                position.properties = stepBox.properties;
                position.destination = stepBox.destinationPoint;
                $rootScope.$broadcast(events.positionUpdated, position);
            }
        }

        function routeExists() {
            return !!(currentRoute.geom);
        }

        /**
         * Foreach step in the route geojson, return a stepBox object
         *
         *  StepBox: {
         *      polygon: a slightly buffered polygon feature that surrounds the points on the route step
         *      destinationPoint: the last Point on the route step
         *      properties: the properties object of the next step in the route (has directions info)
         *  }
         *
         * @param  {[type]} geojson [description]
         * @return {object}         Array of stepBox objects, see above
         */
        function generateStepBoxes(geojson) {
            var lastDirection = {
                directions: {
                    text: 'Arrive at destination'
                }
            };
            var stepBoxes = [];
            var numFeatures = geojson.features.length;
            angular.forEach(geojson.features, function (feature, index) {
                var length = feature.geometry.coordinates.length;
                var lastPoint = turf.point(feature.geometry.coordinates[length - 1]);
                // Get the next feature's properties, because the next directions for the current
                //  step are on the next feature
                var nextFeature = index < numFeatures - 1 ? geojson.features[index + 1] : null;
                // If we're at the last feature, return the last directions text instead
                var properties = nextFeature ? nextFeature.properties : lastDirection;
                var stepBox = {
                    polygon: turf.buffer(turf.envelope(feature), stepLengthMiles * 0.25, 'miles').features[0],
                    destinationPoint: lastPoint,
                    properties: properties
                };
                stepBoxes.push(stepBox);
            });
            return stepBoxes;
        }

        /**
         * Returns the stepBox that contains the passed Point feature
         * @param  {object Point} point point to search the stepboxes for a match
         * @return {object}       the stepbox or undefined
         */
        function findStepBoxForPoint(point) {
            return _.find(currentRoute.stepBoxes, function (stepBox) {
                return turf.inside(point, stepBox.polygon);
            });
        }

        /**
         * Temporary reimplementation of turf.along() that includes the fix mentioned here:
         * https://github.com/Turfjs/turf-along/pull/1
         *
         * TODO: Replace with turf.along call once the fix above is merged and turf is updated
         *
         * Params and return match turf.along()
         */
        function along(line, dist, units) {
            /* jshint curly:false */
            var coords;
            if(line.type === 'Feature') coords = line.geometry.coordinates;
            else if(line.type === 'LineString') coords = line.geometry.coordinates;
            else throw new Error('input must be a LineString Feature or Geometry');

            var travelled = 0;
            for(var i = 0; i < coords.length; i++) {
                if (dist >= travelled && i === coords.length - 1) break;
                else if(travelled >= dist) {
                    var overshot = dist - travelled;
                    if(!overshot) return turf.point(coords[i]);
                    else {
                        var direction = turf.bearing(turf.point(coords[i]), turf.point(coords[i-1])) - 180;
                        var interpolated = turf.destination(turf.point(coords[i]), overshot, direction, units);
                        return interpolated;
                    }
                }
                else {
                    travelled += turf.distance(turf.point(coords[i]), turf.point(coords[i+1]), units);
                }
            }
            return turf.point(coords[coords.length - 1]);
            /* jshint curly:true */
        }
    }

    angular.module('nih.navigation')
      .factory('Navigation', Navigation);

})();
