(function () {
    'use strict';

    /* ngInject */
    function RerouteController($state, Rerouting, NavbarConfig) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Reroute' });
            ctl.gridOptions = Rerouting.getReroutingOptions();
            ctl.optionClicked = optionClicked;
        }

      function optionClicked(option) {
          rerouteWith(option);
      }

      function rerouteWith(option) {
          Rerouting.reroute(option);
          $state.go('navigate');
      }
    }

    angular.module('nih.views.navigate')
      .controller('RerouteController', RerouteController);

})();
