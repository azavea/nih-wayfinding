(function () {
    'use strict';

    /* ngInject */
    function SelectTypeController($state, NavbarConfig, UserLocations, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
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

      function optionClicked(option) {
          setLocationType(option);
      }

      function setLocationType(type) {
          UserLocations.setLocationType(type); // Set location type for temporary representation

          var currentUser = ProfileService.getCurrentUser().username;
          var id = UserLocations.getWorkingLocation().id;
          $state.go('locationsProfile', { username: currentUser, locationID: id });
      }

    }

    angular.module('nih.views.locations')
      .controller('SelectTypeController', SelectTypeController);

})();
