(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(
        $stateParams, $state,
        Geocoder, NavbarConfig, ProfileService
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
                { img: '/images/icons/icon-cafe.svg', type: 'Cafe' },
                { img: '/images/icons/icon-house.svg', type: 'House' },
                { img: '/images/icons/icon-park.svg', type: 'Park' },
                { img: '/images/icons/icon-shopping.svg', type: 'Shopping' },
                { img: '/images/icons/icon-cafe.svg', type: 'Donut Shop' },
                { img: '/images/icons/icon-house.svg', type: 'Other' },
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

            // field validation
            ctl.labelErrorMsg = '';
            ctl.addressErrorMsg = '';
            ctl.checkLabel = checkLabel;
            ctl.checkAddress = checkAddress;

            // Final validation
            ctl.validateBeforeReview = validateBeforeReview;
        }

        /**
         * Use the default icon for the selected location type
         */
        function setImageByType() {
            _.each(ctl.imgOpts, function(imgOpt) {
                if (imgOpt.type === ctl.user.tempLocation.type) {
                    ctl.user.tempLocation.img = imgOpt.img;
                    return;
                }
            });
        }

        /**
         * Geocode an address and save geocoded data or notify of geocoding failure
         * @param searchText {string} an address
         * @return {undefined}
         */
        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey).then(function(data) {
                // Add geometric features to location tracker
                ctl.user.setTempLocationProperty('feature', data[0]);
                ctl.addressErrorMsg = '';
                ctl.profile.$setValidity('locationsProfile.user.tempLocation.address', true);
            }, function(error) {
                ctl.addressErrorMsg = error;
                ctl.profile.$setValidity('locationsProfile.user.tempLocation.address', false);
            });
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
         * Validate the location label entered.
         * Sets error message text and Angular input validity.
         */
        function checkLabel() {
            if (!ctl.user.tempLocation.text) {
                ctl.labelErrorMsg = 'Location label is required';
                return; // 'required' check will set validity
            }

            // check if label is unique
            var usingLabel = _.find(ctl.user.locations, function(location) {
                return location.text === ctl.user.tempLocation.text;
            });

            if (usingLabel) {
                ctl.labelErrorMsg = 'A location of that name already exists';
                ctl.profile.$setValidity('locationsProfile.user.tempLocation.text', false);
            } else {
                ctl.labelErrorMsg = '';
                ctl.profile.$setValidity('locationsProfile.user.tempLocation.text', true);
            }
        }

        /**
         * Validate the address text entered.
         * Sets error message text and Angular input validity.
         */
        function checkAddress() {
            if (!ctl.user.tempLocation.address) {
                ctl.addressErrorMsg = 'Address is required';
                return; // 'required' check will set validity
            }
            ctl.addressErrorMsg = '';
        }

        /**
         * Validate the model's data to ensure it will produce a satisfactory location
         */
        function validateBeforeReview() {
            if (!ctl.user.tempLocation.feature) { // If address fails to validate
                ctl.addressErrorMsg = 'No coordinates found for this address. Please choose a different address.';
                ctl.profile.$setValidity('locationsProfile.user.tempLocation.address', false);
            } else { // If we have both a label and an address
                var geom = ctl.user.tempLocation.feature.geometry;
                var xyString = geom.x.toString() + ',' + geom.y.toString(); // Cast to string

                // set default image for location type, if no image selected
                if (!ctl.user.tempLocation.img) {
                    setImageByType();
                }
                ctl.user.save();
                $state.go('locationsReview', { destination: xyString }); // Use as url params
            }
        }
    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
