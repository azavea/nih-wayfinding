
(function () {
    'use strict';

    /* ngInject */
    function RerouteListController(
            $state, $stateParams,
            Directions, Map, NavbarConfig, Navigation, Rerouting
    ) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.amenities = [];
            ctl.onSelectAmenity = onSelectAmenity;

            NavbarConfig.set({
                title: 'Reroute',
                color: NavbarConfig.colors.reroute,
                back: 'reroute'
            });
            handleReroute($stateParams.type);
        }

        /**
         * Called whenever this controller is instantiated - if a `reroute` query parameter is specified,
         *  find nearby amenities which match that query parameter and display them on the map. If any
         *  are displayed on the map, change the bottom dialog to 'Cancel' and 'Route' buttons, which
         *  control whether and when the route is changed to some nearby amenity.
         *
         * @param rerouteType {string} The query parameter string fed to `?reroute=`
         */
        function handleReroute(rerouteType) {
            Navigation.getCurrentPosition().then(function (position) {
                var currentPosition = [position.coords.latitude, position.coords.longitude];
                Rerouting.reroute(currentPosition, rerouteType).then(success, failure);
                function success(amenities) {
                    // Amenities are already sorted by distance
                    ctl.amenities = _.take(amenities, 5);
                }
                function failure(error) {
                    // TODO: error handle when workflow is decided
                    console.log(error);
                }
            });
        }

        /**
         * Generate a route and display it on the map for a given user position and targetted destination
         */
        function planReroute(destination) {
            var currentPosition;
            Navigation.getCurrentPosition().then(function(position) {
                currentPosition = [position.coords.longitude, position.coords.latitude];
                Directions.get(currentPosition,
                               [destination.lng, destination.lat]).then(success, failure);
            });
            function success(response) {
                angular.extend(Map.geojson, {
                    data: response
                });
                $state.go('navigate');
            }
            function failure(error) {
                // TODO: error handle when workflow is decided
                console.log(error);
            }
        }


        function onSelectAmenity(amenity) {
            planReroute({
                lat: amenity.geometry.location.k,
                lng: amenity.geometry.location.B
            });
        }

    }

    angular.module('nih.views.navigate')
      .controller('RerouteListController', RerouteListController);

})();
