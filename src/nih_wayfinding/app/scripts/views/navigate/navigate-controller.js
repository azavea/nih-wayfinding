/**
 *
 * This navigation controller does nothing, now that the Directions.get endpoint returns an
 * actual response. Rather than restub it out now, we can just properly build out the remainder
 * of the interactions on this view all at once.
 *
 * TODO:
 *   - Init map at current location navigating to destination param via Directions.get()
 *   - Add direction text, e.g. Turn left in x ft at 1000 Market St
 *   - When we approach each step, speak audible alert and then switch the current direction text
 *   - Offer to reroute user if they leave the current path
 */
(function () {
    'use strict';

    /* ngInject */
    function NavigateController(
        $scope,
        Navigation, Directions, Map, MapStyle, NavbarConfig, MapControl
    ) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({
                title: 'Navigate Route',
                back: 'routing'
            });
            ctl.map = Map;

            Navigation.setIntervalMillis(800);
            var directionQ = Directions.get();
            directionQ.then(setGeojson);
            directionQ.then(Navigation.walkTheLine);

            // Subscribe to the location update event
            $scope.$on('nih.navigation.locationUpdated', function(event, data) {
                MapControl.trackUser(data);
                angular.extend(ctl.map.center, {
                    lat: data[1],
                    lng: data[0],
                    zoom: 19
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
