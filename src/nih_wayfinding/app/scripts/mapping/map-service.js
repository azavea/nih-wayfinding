
(function () {
    'use strict';

    /* ngInject */
    function Map (leafletBoundsHelpers, Config, MapStyle) {

        var defaultBounds = Config.bounds;
        var defaultCenter = Config.center;
        var defaultLayers = {
            baselayers: Config.baseLayers
        };
        var defaultLegend = {
            colors: MapStyle.getLegendRamp(),
            labels: ['Recent Review', 'Older Review', 'Unreviewed']
        };

        var module = {
            bounds: defaultBounds,
            center: defaultCenter,
            layers: defaultLayers,
            legend: defaultLegend
        };

        return module;
    }

    angular.module('nih.mapping')
    .factory('Map', Map);

})();
