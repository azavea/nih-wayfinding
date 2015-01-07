
(function () {
    'use strict';

    /* ngInject */
    function MapStyle () {

        var module = {
            getLegendRamp: getLegendRamp,
            routeStyle: routeStyle
        };

        return module;

        function getLegendRamp() {
            return [
                '#3475A0',
                '#E0AD0A',
                '#000000'
            ];
        }

        function routeStyle() {
            return {
                color: 'black',
                opacity: 1,
                weight: 2
            };
        }
    }

    angular.module('nih.mapping')
    .factory('MapStyle', MapStyle);

})();
