(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(
        $stateParams, $state,
        Geocoder, NavbarConfig, UserLocations, ProfileService
    ) {
        var ctl = this;
        initialize();

        ctl.glyphiconClass = 'glyphicon-star';
        function initialize() {
            NavbarConfig.set({ title: 'Location Profile' });
            var currentUser = ProfileService.getCurrentUser().username;
            ctl.currentLocation = UserLocations.getLocationByID(currentUser, $stateParams.id);
            ctl.saveCurrent = saveCurrent;

            // Search vars
            ctl.findAddressExpanded = false;
            ctl.search = search;
            ctl.suggest = Geocoder.suggest;
        }

        function search(searchText) {
            Geocoder.search(searchText).then(onGeocoderResponse);
        }

        function onGeocoderResponse(data) {
            if (data.length) { // If non-empty result
                var geom = data[0].geometry; // Grab first result
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            } else { // If empty result
                console.log('sorry, no data here!'); // ?
            }
        }

        function saveCurrent(location) {
            UserLocations.setLocationLabel(location.label);
            UserLocations.setLocationIcon(location.icon);
            UserLocations.setLocationAddress(location.address);
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
