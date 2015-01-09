(function () {
    'use strict';

    /* ngInject */
    function NavigateController(
        $scope,
        leafletData,
        Navigation, Directions, Map, MapStyle, NavbarConfig, MapControl
    ) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Navigate Route' });
            ctl.map = Map;

            Navigation.setInterval(800);
            var directionQ = Directions.get();
            directionQ.then(setGeojson);
            directionQ.then(Navigation.walkTheLine);
            directionQ.then(function() {
                // Zoom in for navigation purposes
                leafletData.getMap().then(function(map) {
                    map.setZoom(19);
                });
            });

            // Subscribe to the location update event
            $scope.$on('nih.navigation.locationUpdated', function(event, data) {
                MapControl.trackUser(data);
                angular.extend(ctl.map.center, {
                    lat: data[1],
                    lng: data[0]
                });
            });
            $scope.$on('$stateChangeStart', Navigation.stopIntervalTask);
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

    angular.module('nih.views.navigate')
      .controller('NavigateController', NavigateController);

})();
