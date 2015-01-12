(function () {
    'use strict';

    /* ngInject */
    function Reporting(ReportingOptions) {

        var module = {
            getReportingOptions: getReportingOptions
        };
        return module;

        function getReportingOptions() {
            return ReportingOptions;
        }
    }

    angular.module('nih.routing')
    .factory('Reporting', Reporting);

})();
