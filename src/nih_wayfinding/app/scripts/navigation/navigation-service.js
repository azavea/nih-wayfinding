
(function () {
    'use strict';

    /* ngInject */
    function Navigation (
        $q, $interval, $rootScope, $timeout,
        $geolocation,
        Config
    ) {

        var events = {
            positionUpdated: 'nih.navigation.positionUpdated',
            positionOffCourse: 'nih.navigation.positionOffCourse'
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
        var originalDestination = null;

        var module = {
            getCurrentPosition: getCurrentPosition,
            isRerouting: isRerouting,
            offCourse: offCourse,
            getDestination: getDestination,
            setDestination: setDestination,
            setRoute: setRoute,
            stepCurrent: stepCurrent,
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
            var point = position.point;
            var latitude = Config.stubs.geolocation.latitude;
            var longitude = Config.stubs.geolocation.longitude;
            if (point) {
                latitude = point.geometry.coordinates[1];
                longitude = point.geometry.coordinates[0];
            }
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
         * Trigger an 'off-route' location value, by using the current route + location and routing
         *     choosing a point 90 degrees off the route by a few hundred feet
         *
         * Does nothing if a route does not exist
         *
         * Triggers events.positionOffCourse event
         */
        function offCourse() {
            getCurrentPosition().then(function (position) {
                if (!routeExists()) {
                    return;
                }
                var startPoint = turf.point([position.coords.longitude, position.coords.latitude]);
                var nextRoutePoint = turf.along(currentRoute.geom, currentRoute.stepped + stepLengthMiles, 'miles');
                var currentBearing = turf.bearing(startPoint, nextRoutePoint);
                var bearing = currentBearing + 90;
                if (bearing > 180) {
                    bearing -= 360;
                }
                var reroutePoint = turf.destination(startPoint, stepLengthMiles * 2, bearing, 'miles');
                $rootScope.$broadcast(events.positionOffCourse, reroutePoint);
            });
        }

        function getDestination() {
            return originalDestination;
        }

        function setDestination(destination) {
            originalDestination = destination;
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

            // Flatten the original FeatureCollection linestring to a single linestring
            //  so we can properly step along it
            // Only reset the line string if the route is new
            var newLinestring = turf.linestring(coordinates);
            if (!linestringEquals(currentRoute.geom, newLinestring)) {
                currentRoute.stepBoxes = generateStepBoxes(geojsonRoute);
                currentRoute.geom = turf.linestring(coordinates);
                currentRoute.distance = turf.lineDistance(currentRoute.geom, 'miles');
                currentRoute.stepped = 0;
            }
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

        function stepCurrent() {
            setPosition(currentRoute.stepped);
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
                var point = turf.along(currentRoute.geom, distance, 'miles');
                var stepBox = findStepBoxForPoint(point, currentRoute.stepped);
                if (stepBox) {
                    // Pass all relevant position info
                    //  point, properties, next destination point
                    position.point = point;
                    position.properties = stepBox.properties;
                    position.destination = stepBox.destinationPoint;
                    $rootScope.$broadcast(events.positionUpdated, position);
                }
            }
        }

        function routeExists() {
            return !!(currentRoute.geom);
        }

        function isRerouting() {
            if (!(currentRoute.geom && currentRoute.geom.geometry)) {
                return false;
            }
            var src = turf.point(originalDestination);
            var dest = turf.point(_(currentRoute.geom.geometry.coordinates).last());
            var distanceMeters = turf.distance(src, dest, 'kilometers') * 1000;
            return distanceMeters > 15;
        }

        /**
         * Foreach step in the route geojson, return a stepBox object
         *
         *  StepBox: {
         *      polygon: a slightly buffered polygon feature that surrounds the points on the route step
         *      destinationPoint: the last Point on the route step
         *      properties: the properties object of the next step in the route (has directions info)
         *      distance: {
         *          min: Number the min distance that this step box is along the route
         *          max: Number the max distance that this step box is along the route
         *      }
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
            var totalDistance = 0;
            angular.forEach(geojson.features, function (feature, index) {
                var length = feature.geometry.coordinates.length;
                var lastPoint = turf.point(feature.geometry.coordinates[length - 1]);
                // Get the next feature's properties, because the next directions for the current
                //  step are on the next feature
                var nextFeature = index < numFeatures - 1 ? geojson.features[index + 1] : null;
                // If we're at the last feature, return the last directions text instead
                var properties = nextFeature ? nextFeature.properties : lastDirection;
                var lineLength = turf.lineDistance(feature, 'miles');
                var minDistance = totalDistance;
                var maxDistance = minDistance + lineLength;
                var stepBox = {
                    polygon: turf.buffer(turf.envelope(feature), stepLengthMiles * 0.25, 'miles').features[0],
                    destinationPoint: lastPoint,
                    properties: properties,
                    distance: {
                        min: minDistance,
                        max: maxDistance
                    }
                };
                stepBoxes.push(stepBox);
                totalDistance += lineLength;
            });
            return stepBoxes;
        }

        // For our purposes in determining whether the linestring route geom has changed, two
        // linestrings are equal if their lengths match and the first and last points in the
        // line are the same
        function linestringEquals(a, b) {
            if (!a || !b || a.length !== b.length) {
                return false;
            }
            var len = a.geometry.coordinates.length;
            var aFirst = a.geometry.coordinates[0];
            var bFirst = b.geometry.coordinates[0];
            var aLast = a.geometry.coordinates[len - 1];
            var bLast = b.geometry.coordinates[len - 1];
            if (aFirst[0] === bFirst[0] && aFirst[1] === bFirst[1] &&
                aLast[0] === bLast[0] && aLast[1] === bLast[1]) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Returns the stepBox that contains the passed Point feature
         * @param  {object Point} point point to search the stepboxes for a match
         * @param  {Number} distance distance along route that the passed point is
         * @return {object}       the stepbox or undefined
         */
        function findStepBoxForPoint(point, distance) {
            return _.find(currentRoute.stepBoxes, function (stepBox) {
                return turf.inside(point, stepBox.polygon) && distance >= stepBox.distance.min && distance <= stepBox.distance.max;
            });
        }
    }

    angular.module('nih.navigation')
      .factory('Navigation', Navigation);

})();
