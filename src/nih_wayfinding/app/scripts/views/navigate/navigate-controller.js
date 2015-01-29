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

            // Subscribe to the location update event
            $scope.$on('nih.navigation.positionUpdated', function(event, point) {
                MapControl.trackUser([point.longitude, point.latitude]);
                angular.extend(ctl.map.center, {
                    lat: point.latitude,
                    lng: point.longitude,
                    zoom: 19
                });
            });

            var geojson = ctl.map.geojson.data;
            var coordinates = _(geojson.features).map(function (feature) {
                return feature.geometry.coordinates;
            }).flatten(true).value();
            // TODO: Interpolate coordinates to step at approx walking speed
            Navigation.setRoute(coordinates);
            Navigation.stepFirst();
        }
    }

    angular.module('nih.views.navigate')
      .controller('NavigateController', NavigateController);

})();
