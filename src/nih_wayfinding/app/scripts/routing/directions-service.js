
(function () {
    'use strict';

    /* ngInject */
    function Directions ($http, $timeout, RoutingResponseStub) {

        // TODO: Wire to actual service
        var directionsUrl = 'http://localhost/directions';

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
/*
            var params = angular.extend({}, defaults, options);
            // TODO: Implement
            // TODO: error check origin/dest options
            params.origin = origin;
            params.destination = destination;
            return $http.post(directionsUrl, params, {});
*/
            console.log(options);
            return $timeout(function () {
                return RoutingResponseStub;
            }, 100, false);
        }

        function getFlagIconName(flagType) {
            // TODO: Write tests once actual icons exist
            switch (flagType) {
                case 'bench':
                    return 'glyphicon-flash';
                case 'hazard':
                    return 'glyphicon-warning-sign';
                case 'bathroom':
                    return 'glyphicon-trash';
                default:
                    return 'glyphicon-info-sign';
            }
        }

        function getTurnIconName(turnType) {
            // TODO: Write tests once actual icons exist
            switch (turnType) {
                case 'straight':
                    return 'glyphicon-arrow-up';
                // Temporarily fall through to non-slight case for left/right
                case 'left':
                case 'slightleft':
                    return 'glyphicon-arrow-left';
                case 'right':
                case 'slightright':
                    return 'glyphicon-arrow-right';
                case 'end':
                    return 'glyphicon-flag';
                default:
                    return 'glyphicon-remove-circle';
            }
        }
    }

    angular.module('nih.routing')
    .factory('Directions', Directions);

})();
