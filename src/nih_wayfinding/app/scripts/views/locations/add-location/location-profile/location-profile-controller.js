(function () {
    'use strict';

    /* ngInject */
    function LocationsProfileController(NavbarConfig, UserLocations) {
        var ctl = this;
        initialize();

        ctl.glyphiconClass = 'glyphicon-star';
        function initialize() {
            NavbarConfig.set({ title: 'Location Profile' });
            ctl.optionClicked = optionClicked;
            ctl.gridOptions = [
            ];
        }

      function optionClicked(option) {
          setLocationType(option);
      }

      function setLocationType(type) {
          UserLocations.setLocationType(type); // Set location type for temporary representation
      }

    }

    angular.module('nih.views.locations')
      .controller('LocationsProfileController', LocationsProfileController);

})();
