(function () {
    'use strict';

    /* ngInject */
    function SelectTypeController($state, NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.user = ProfileService.getCurrentUser();
            ctl.user.startTempLocation();
            NavbarConfig.set({
                title: 'Location Type',
                color: NavbarConfig.colors.profile
            });
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
            ctl.user.setTempLocationProperty('type', type);
            ctl.user.save();

            $state.go('locationsProfile', {
                username: ctl.user.username,
                locationID: ctl.user.tempLocation.id
            });
        }

    }

    angular.module('nih.views.locations')
      .controller('SelectTypeController', SelectTypeController);

})();
