(function () {
    'use strict';

    /* ngInject */
    function DirectionsController($scope, Directions, Map, MapStyle, NavbarConfig) {

        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({
                title: 'Directions',
                color: NavbarConfig.colors.routing
            });

            ctl.getLineColor = MapStyle.getLineColor;
            ctl.getTurnIconName = Directions.getTurnIconName;

            var geojson = Map.geojson && Map.geojson.data ? Map.geojson.data : null;
            setDirectionsListData(geojson);

            $scope.$on('$stateChangeStart', onStateChangeStart);
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

        function onStateChangeStart(event, toState, toParams) {
            if (toState.name === 'routing') {
                // setting this triggers geojson load from cache on overview view
                toParams.back = true;
            }
        }

    }

    angular.module('nih.views.routing')
    .controller('DirectionsController', DirectionsController);
})();
