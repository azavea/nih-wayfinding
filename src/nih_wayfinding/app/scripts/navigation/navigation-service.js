
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
        var currentIndex = 0;
        var currentRoute = [];  // An array of [lon, lat]
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
            currentRoute = newRoute;
        }

        function stepNext() {
            setPosition(currentIndex + 1);
        }

        function stepPrevious() {
            setPosition(currentIndex - 1);
        }

        function stepFirst() {
            setPosition(0);
        }

        function stepLast() {
            setPosition(currentRoute.length - 1);
        }

        function setPosition(index) {
            index = parseInt(index, 10);
            if (routeExists() && index >= 0 && index < currentRoute.length) {
                position.latitude = currentRoute[index][1];
                position.longitude = currentRoute[index][0];
                currentIndex = index;
                $rootScope.$broadcast(events.positionUpdated, position);
            }
        }

        function routeExists() {
            return _.isArray(currentRoute) && currentRoute.length;
        }
    }

    angular.module('nih.navigation')
      .factory('Navigation', Navigation);

})();
