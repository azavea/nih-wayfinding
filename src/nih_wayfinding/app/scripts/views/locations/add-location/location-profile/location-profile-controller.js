(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(
        $stateParams, $state,
        Geocoder, NavbarConfig, Notifications, ProfileService
    ) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Location Profile' });
            ctl.user = ProfileService.getCurrentUser();
            if (!ctl.user.tempLocation) {
                $state.go('locationsSelectType');
            }

            // Hidden image selection dialog
            ctl.showIconSelect = false;
            ctl.toggleIconSelectDialog = toggleIconSelectDialog;
            ctl.imgOpts = [
                { img: '/images/icons/icon-house.svg' },
                { img: '/images/icons/icon-house.svg' },
                { img: '/images/icons/icon-house.svg' },
                { img: '/images/icons/icon-house.svg' },
                { img: '/images/icons/icon-house.svg' },
                { img: '/images/icons/icon-house.svg' },
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
        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey).then(onGeocoderResponse);
        }

        /**
         * Save geocoded data or notify of geocoding failure
         * @param data {object} data from Geocoder service
         * @return undefined
         */
        function onGeocoderResponse(data) {
            if (data.length) { // If non-empty result
                // Add geometric features to location tracker
                ctl.user.setTempLocationProperty('feature', data[0]);
            } else { // If empty result
                ctl.user.setTempLocationProperty('feature', undefined);
                Notifications.show({
                    text: 'Unable to find the selected address. Please try a different one.'
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
            ctl.user.setTempLocationProperty('img', option.img);
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
            if (!ctl.user.tempLocation.text) { // If there's no label
                Notifications.show({
                    text: 'No label specified - please label this location.'
                });
            } else if (!ctl.user.tempLocation.feature) { // If address fails to validate
                Notifications.show({
                    text: 'No coordinates found for this address - please choose a different address.'
                });
            } else { // If we have both a label and an address
                var geom = ctl.user.tempLocation.feature.geometry;
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string
                ctl.user.save();
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            }
        }
    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
