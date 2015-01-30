
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
            latitude: 0,
            longitude: 0
        };
        var stepLengthFeet = Config.stepLengthFeet || 100;
        var stepLengthMiles = stepLengthFeet / 5280;
        var lineDistance = 0;
        var steppedDistance = 0;
        var currentRoute = null;  // A linestring
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

        function setRoute(newRoute) {
            currentRoute = turf.linestring(newRoute);
            lineDistance = turf.lineDistance(currentRoute, 'miles');
            steppedDistance = 0;
        }

        function stepNext() {
            steppedDistance += stepLengthMiles;
            setPosition(steppedDistance);
        }

        function stepPrevious() {
            steppedDistance -= stepLengthMiles;
            setPosition(steppedDistance);
        }

        function stepFirst() {
            setPosition(0);
        }

        function stepLast() {
            setPosition(lineDistance);
        }

        function setPosition(distance) {
            if (distance > lineDistance) {
                distance = lineDistance;
                steppedDistance = lineDistance;
            }
            if (distance < 0) {
                distance = 0;
                steppedDistance = 0;
            }
            if (routeExists()) {
                var point = along(currentRoute, distance, 'miles');
                position.latitude = point.geometry.coordinates[1];
                position.longitude = point.geometry.coordinates[0];
                $rootScope.$broadcast(events.positionUpdated, position);
            }
        }

        function routeExists() {
            return !!(currentRoute);
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
