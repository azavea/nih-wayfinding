(function () {
    'use strict';

    /* ngInject */
    function OverviewController(Directions, Map, MapStyle, NavbarConfig) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Preview Route' });
            ctl.map = Map;
            Directions.get().then(setGeojson);
        }

        function setGeojson(geojson) {
            angular.extend(ctl.map, {
                geojson: {
                    data: geojson,
                    style: MapStyle.routeStyle,
                    resetStyleOnMouseout: true
                }
            });
        }
    }

    angular.module('nih.views.routing')
    .controller('OverviewController', OverviewController);

})();