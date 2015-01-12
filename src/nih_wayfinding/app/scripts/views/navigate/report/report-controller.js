(function () {
    'use strict';

    /* ngInject */
    function ReportController(NavbarConfig, Reporting) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Report' });
            ctl.gridOptions = Reporting.getReportingOptions();
            ctl.optionClicked = optionClicked;
        }

      function optionClicked(option) {
          reportIssue(option);
      }

      function reportIssue(issue) {
          console.log(issue.text + ' reported');
      }
    }

    angular.module('nih.views.navigate')
      .controller('ReportController', ReportController);

})();
