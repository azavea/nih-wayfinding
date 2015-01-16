(function () {
    'use strict';

    /* ngInject */
    function LocationsReviewController($scope, $stateParams, $q,
                                       Config, Map, MapControl, NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.user = ProfileService.getCurrentUser();
            NavbarConfig.set({
                title: 'Review Location',
                back: 'locationsProfile'
            });
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

        /**
         * Call location service's addLocation method to add the current working model
         */
        function confirmLocation() {
            ctl.user.finishLocation();
            ctl.user.save();
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsReviewController', LocationsReviewController);

})();
