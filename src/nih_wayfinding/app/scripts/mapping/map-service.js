
(function () {
    'use strict';

    /* ngInject */
    function Map (leafletBoundsHelpers, Config, MapStyle) {

        var defaultBounds = angular.extend({}, Config.bounds);
        var defaultCenter = angular.extend({}, Config.center);
        var defaultLayers = {
            baselayers: Config.baseLayers
        };
        var defaultLegend = {
            colors: MapStyle.getLegendRamp(),
            labels: ['Recent Review', 'Older Review', 'Unreviewed']
        };
        var defaultMarkers = {};

        var module = {
            bounds: defaultBounds,
            center: defaultCenter,
            layers: defaultLayers,
            legend: defaultLegend,
            markers: defaultMarkers
        };

        return module;
    }

    angular.module('nih.mapping')
    .factory('Map', Map);

})();
