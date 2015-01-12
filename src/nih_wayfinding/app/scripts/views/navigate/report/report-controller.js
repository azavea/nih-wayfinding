(function () {
    'use strict';

    /* ngInject */
    function ReportController(NavbarConfig, Notifications, Reporting) {
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
            Notifications.show({
                text: 'Your issue (' + issue.text + ') was successfully reported!',
                imageClass: 'glyphicon-ok-circle',
                timeout: 2000
            });
        }
    }

    angular.module('nih.views.navigate')
      .controller('ReportController', ReportController);

})();
