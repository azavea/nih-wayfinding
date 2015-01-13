(function () {
    'use strict';

    /* ngInject */
    function LocationsReviewController($scope, $stateParams, $q,
                                       Config, Map, MapControl, NavbarConfig, UserLocations, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({
                title: 'Review Location',
                back: 'locationsProfile'
            });
            ctl.currentLocation = UserLocations.getWorkingLocation();
            ctl.currentUser = ProfileService.getCurrentUser().username;
            ctl.confirmLocation = confirmLocation;

            // Map stuff
            ctl.map = Map;
            ctl.coordinates = MapControl.cleanLonLatParam($stateParams.destination);
            angular.extend(ctl.map.center, {
                lat: ctl.coordinates[1],
                lng: ctl.coordinates[0],
                zoom: 17
            });
            angular.extend(ctl.map.bounds, Config.bounds);
            MapControl.markLocation(ctl.coordinates);
        }

        function confirmLocation() {
            console.log(UserLocations.getWorkingLocation());
            UserLocations.addLocation();
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsReviewController', LocationsReviewController);

})();
