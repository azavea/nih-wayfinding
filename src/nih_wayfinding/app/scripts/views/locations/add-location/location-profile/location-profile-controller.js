(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(
        $stateParams, $state,
        Geocoder, NavbarConfig, UserLocations, Notifications
    ) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Location Profile' });
            ctl.workingLocation = UserLocations.getLocationByID($stateParams.id) ||
                UserLocations.workingLocation;

            // Hidden image selection dialog
            ctl.showIconSelect = false;
            ctl.toggleIconSelectDialog = toggleIconSelectDialog;
            ctl.imgOpts = [
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
                { img: 'http://localhost:8001/images/icons/icon-house.svg' },
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

        /**
         * Geocode an address and pass it to onGeocoderResponse
         * @param searchText {string} an address
         * @return {undefined}
         */
        function search(searchText) {
            Geocoder.search(searchText).then(onGeocoderResponse);
        }

        /**
         * Save geocoded data or notify of geocoding failure
         * @param data {object} data from Geocoder service
         * @return undefined
         */
        function onGeocoderResponse(data) {
            if (data.length) { // If non-empty result
                // Add geometric features to location tracker
                ctl.workingLocation.feature = data[0];
            } else { // If empty result
                ctl.workingLocation.feature = undefined;
                Notifications.show({
                    text: 'Unable to find the selected address. Please try a different one.',
                    timeout: 3000
                });
            }
        }

        /**
         * Select img option
         * @param option {object} the object corresponding to an option-directive option
         */
        function imgOptionClicked(option) {
            ctl.showIconSelect = false;
            ctl.showUploadDialog = false;
            ctl.workingLocation.img = option.img;
        }

        /**
         * Select upload option
         * @param option {object} the object corresponding to an option-directive option
         */
        function uploadOptionClicked(option) {
            console.log(option.text);
        }

        /**
         * DOM wrestling for handling dialogs
         */
        function toggleIconSelectDialog() {
            ctl.showIconUpload = false;
            ctl.showIconSelect = !ctl.showIconSelect;
        }

        /**
         * DOM wrestling for handling dialogs
         */
        function toggleIconUploadDialog() {
            ctl.showIconSelect = false;
            ctl.showIconUpload = !ctl.showIconUpload;
        }

        /**
         * Validate the model's data to ensure it will produce a satisfactory location
         */
        function validateBeforeReview() {
            if (ctl.workingLocation.text === undefined) { // If there's no label
                Notifications.show({
                    text: 'No label specified - please label this location.',
                    timeout: 3000
                });
            } else if (ctl.workingLocation.feature === undefined) { // If address fails to validate
                Notifications.show({
                    text: 'No coordinates found for this address - please choose an address.',
                    timeout: 3000
                });
            } else { // If we have both a label and an address
                var geom = ctl.workingLocation.feature.geometry;
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string
                UserLocations.workingLocation = ctl.workingLocation;
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            }
        }

    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
