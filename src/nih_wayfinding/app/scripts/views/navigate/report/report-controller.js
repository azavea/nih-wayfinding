(function () {
    'use strict';

    /* ngInject */
    function ReportController(
        NavbarConfig
    ) {
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Report' });
        }
    }

    angular.module('nih.views.navigate')
      .controller('ReportController', ReportController);

})();
