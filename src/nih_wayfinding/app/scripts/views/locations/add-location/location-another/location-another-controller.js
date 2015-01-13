(function () {
    'use strict';

    /* ngInject */
    function LocationsAnotherController($state, NavbarConfig, UserLocations, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Custom Locations' });
            ctl.optionClicked = optionClicked;
            ctl.gridOptions = [
                { text: 'Yes' },
                { text: 'No thanks' }
            ];
        }

      function optionClicked(option) {
          goNext(option.text);
      }

      function goNext(answer) {
          console.log(answer);
          if (answer === 'yes') {
              $state.go('locationsSetType');
          } else {
              $state.go('locations');
          }
      }

    }

    angular.module('nih.views.locations')
      .controller('LocationsAnotherController', LocationsAnotherController);

})();
