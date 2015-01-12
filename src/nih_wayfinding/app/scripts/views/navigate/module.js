(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('navigate', {
            url: '/navigate',
            templateUrl: 'scripts/views/navigate/navigate-partial.html',
            controller: 'NavigateController',
            controllerAs: 'navigate'
        });

        $stateProvider.state('reroute', {
            url: '/navigate/reroute',
            templateUrl: 'scripts/views/navigate/reroute/reroute-partial.html',
            controller: 'RerouteController',
            controllerAs: 'reroute'
        });

        $stateProvider.state('report', {
            url: '/navigate/report',
            templateUrl: 'scripts/views/navigate/report/report-partial.html',
            controller: 'ReportController',
            controllerAs: 'report'
        });
    }

    angular.module('nih.views.navigate', [
        'ngAria',
        'leaflet-directive',
        'nih.profiles',
        'nih.mapping',
        'nih.routing',
        'nih.navigation',
        'nih.views.navbar'
    ]).config(StateConfig);
})();
