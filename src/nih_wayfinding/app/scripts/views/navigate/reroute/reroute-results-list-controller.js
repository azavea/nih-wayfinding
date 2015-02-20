
(function () {
    'use strict';

    /* ngInject */
    function RerouteListController(
            $state, $stateParams,
            Directions, Map, NavbarConfig, Navigation, Notifications, Rerouting
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
            getNearbyAmenities($stateParams.type);
        }

        function onSelectAmenity(amenity) {
            planReroute({
                lat: amenity.geometry.location.lat(),
                lng: amenity.geometry.location.lng()
            });
        }

        /**
         * Called whenever this controller is instantiated - if a `reroute` query parameter is specified,
         *  find nearby amenities which match that query parameter and display them in a list.
         *
         * @param amenityType {string} The query parameter string fed to `?type=`
         */
        function getNearbyAmenities(amenityType) {
            Navigation.getCurrentPosition().then(function (position) {
                var currentPosition = [position.coords.latitude, position.coords.longitude];
                var originPoint = turf.point(currentPosition.slice().reverse());
                Rerouting.reroute(currentPosition, amenityType).then(function (amenities) {
                    Rerouting.lastChoice = amenityType;
                    angular.forEach(amenities, function (amenity) {
                        var destinationPoint = turf.point([amenity.geometry.location.lng(), amenity.geometry.location.lat()]);
                        amenity.distance = turf.distance(originPoint, destinationPoint, 'kilometers') * 1000;   // meters
                    });
                    ctl.amenities = _.take(amenities, 5).sort(function (a, b) {
                        return a.distance - b.distance;
                    });
                }, failure);
                function failure() {
                    ctl.amenities = [];
                    ctl.errorMessage = 'No nearby amenities for the selected type. Tap \'Back\' to try again.';
                }
            });
        }

        /**
         * Generate a route and display it on the map for a given user position and targeted destination
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
                var msg = error.msg ? error.msg : 'Unable to load route. Please try a different destination.';
                Notifications.show({
                    text: msg
                });
            }
        }
    }

    angular.module('nih.views.navigate')
      .controller('RerouteListController', RerouteListController);

})();
