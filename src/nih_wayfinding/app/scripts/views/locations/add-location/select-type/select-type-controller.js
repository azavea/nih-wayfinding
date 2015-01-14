(function () {
    'use strict';

    /* ngInject */
    function SelectTypeController($state, NavbarConfig, UserLocations, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            UserLocations.workingLocation = UserLocations.newLocation();
            NavbarConfig.set({ title: 'Location Type' });
            ctl.optionClicked = optionClicked;
            ctl.gridOptions = [
                { text: 'Cafe' },
                { text: 'House' },
                { text: 'Park' },
                { text: 'Shopping' },
                { text: 'Donut Shop' },
                { text: 'Other' }
            ];
        }

        /**
         * Select upload option
         * @param option {object} the object corresponding to an option-directive option
         */
        function optionClicked(option) {
            setLocationType(option.text);
        }

        /**
         * Set the location type for our current location model
         */
        function setLocationType(type) {
            UserLocations.workingLocation.type = type;

            var currentUser = ProfileService.getCurrentUser().username;
            $state.go('locationsProfile', {
                username: currentUser,
                locationID: UserLocations.workingLocation.id
            });
        }

    }

    angular.module('nih.views.locations')
      .controller('SelectTypeController', SelectTypeController);

})();
