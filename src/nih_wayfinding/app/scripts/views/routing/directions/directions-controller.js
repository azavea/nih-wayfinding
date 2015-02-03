(function () {
    'use strict';

    /* ngInject */
    function DirectionsController(Directions, Map, MapStyle, NavbarConfig) {

        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Directions'});

            ctl.getFlagIconName = Directions.getFlagIconName;
            ctl.getLineColor = MapStyle.getLineColor;
            ctl.getTurnIconName = Directions.getTurnIconName;

            var geojson = Map.geojson && Map.geojson.data ? Map.geojson.data : null;
            setDirectionsListData(geojson);
        }

        function setDirectionsListData(geojson) {
            if (geojson && geojson.features) {
                ctl.list = _.chain(geojson.features).filter(function (feature) {
                    return feature.geometry.type === 'LineString';
                }).map(function(feature) {
                    return feature.properties;
                }).value();
            } else {
                ctl.list = [{
                    directions: {
                        text: 'No Data',
                        turn: 'end',
                        distanceMeters: -1
                    },
                    lastModified: 0
                }];
            }
        }
    }

    angular.module('nih.views.routing')
    .controller('DirectionsController', DirectionsController);
})();
