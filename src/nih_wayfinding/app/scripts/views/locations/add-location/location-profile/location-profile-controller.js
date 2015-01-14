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

            // Hidden image selection dialog
            ctl.showIconSelect = false;
            ctl.toggleIconSelectDialog = toggleIconSelectDialog;
            ctl.imgOpts = [
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
                { img: 'http://lorempixel.com/200/100/' },
            ];
            ctl.imgOptionClicked = imgOptionClicked;

            // Hidden upload dialog
            ctl.showIconUpload = false;
            ctl.toggleIconUploadDialog = toggleIconUploadDialog;
            ctl.uploadOpts = [
                { text: 'Select File' },
                { text: 'Use Camera' }
            ];
            ctl.uploadOptionClicked = uploadOptionClicked;

            // Search vars
            ctl.findAddressExpanded = false;
            ctl.search = search;
            ctl.suggest = Geocoder.suggest;

            // Final validation
            ctl.validateBeforeReview = validateBeforeReview;
        }

        function search(searchText) {
            Geocoder.search(searchText).then(onGeocoderResponse);
        }

        function onGeocoderResponse(data) {
            if (data.length) { // If non-empty result
                // Add geometric features to location tracker
                ctl.currentLocation.feature = data[0];
            } else { // If empty result
                ctl.currentLocation.feature = undefined;
                Notifications.show({
                    text: 'Unable to find the selected address. Please try a different one.',
                    timeout: 3000
                });
            }
        }

        function imgOptionClicked(option) {
            ctl.showIconSelect = false;
            ctl.showUploadDialog = false;
            ctl.currentLocation.img = option.img;
        }

        function saveCurrent(location) {
            UserLocations.setLocationText(location.text);
            UserLocations.setLocationImg(location.img);
            UserLocations.setLocationAddress(location.address);
            UserLocations.setLocationFeature(location.feature);
        }

        function uploadOptionClicked(option) {
            console.log(option.text);
        }

        function toggleIconSelectDialog() {
            ctl.showIconSelect = !ctl.showIconSelect;
        }

        function toggleIconUploadDialog() {
            ctl.showIconUpload = !ctl.showIconUpload;
        }

        function validateBeforeReview() {
            if (ctl.currentLocation.text === undefined) { // If there's no label
                Notifications.show({
                    text: 'No label specified - please label this location.',
                    timeout: 3000
                });
            } else if (ctl.currentLocation.feature === undefined) { // If address fails to validate
                Notifications.show({
                    text: 'No coordinates found for this address - please choose an address.',
                    timeout: 3000
                });
            } else { // If we have both a label and an address
                saveCurrent(ctl.currentLocation);
                var geom = ctl.currentLocation.feature.geometry;
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            }
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
