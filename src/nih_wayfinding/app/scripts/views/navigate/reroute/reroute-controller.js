(function () {
    'use strict';

    /* ngInject */
    function RerouteController(
        NavbarConfig
    ) {
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Reroute' });
        }
    }

    angular.module('nih.views.navigate')
      .controller('RerouteController', RerouteController);

})();
