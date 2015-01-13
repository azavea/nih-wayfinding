(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(
        $stateParams, $state,
        Geocoder, NavbarConfig, UserLocations, Notifications
    ) {
        var ctl = this;
        initialize();

        ctl.glyphiconClass = 'glyphicon-star';
        function initialize() {
            NavbarConfig.set({ title: 'Location Profile' });
            ctl.currentLocation = UserLocations.getLocationByID($stateParams.id) ||
                UserLocations.getWorkingLocation();
            ctl.saveCurrent = saveCurrent;
            ctl.showIconSelect = false;
            ctl.imgOpts = [
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
            ];
            ctl.imgOptionClicked = imgOptionClicked;

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
                // Add geometric features to location tracker
                ctl.currentLocation.feature = data[0];
                saveCurrent(ctl.currentLocation);

                var geom = data[0].geometry; // Grab first result
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            } else { // If empty result
                Notifications.show({
                    text: 'Unable to find the selected address. Please try a different one.',
                    timeout: 3000
                });
            }
        }

        function imgOptionClicked(option) {
            ctl.showIconSelect = false;
            ctl.currentLocation.img = option.img;
        }

        function saveCurrent(location) {
            UserLocations.setLocationText(location.text);
            UserLocations.setLocationImg(location.img);
            UserLocations.setLocationAddress(location.address);
            UserLocations.setLocationFeature(location.feature);
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
