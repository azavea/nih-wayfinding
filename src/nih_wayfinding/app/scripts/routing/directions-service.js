
(function () {
    'use strict';

    /* ngInject */
    function Directions ($http, $timeout, RoutingResponseStub) {

        // TODO: Wire to actual service
        var directionsUrl = 'http://localhost/directions';

        var module = {
            get: get
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
/*
            var params = angular.extend({}, defaults, options);
            // TODO: Implement
            // TODO: error check origin/dest options
            params.origin = origin;
            params.destination = destination;
            return $http.post(directionsUrl, params, {});
*/
            return $timeout(function () {
                return RoutingResponseStub;
            }, 100, false);
        }
    }

    angular.module('nih.routing')
    .factory('Directions', Directions);

})();
