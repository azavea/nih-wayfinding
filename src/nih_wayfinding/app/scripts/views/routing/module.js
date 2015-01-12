(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('routing', {
            url: '/routing?origin&destination&walkTimeMins',
            templateUrl: 'scripts/views/routing/overview/overview-partial.html',
            controller: 'OverviewController',
            controllerAs: 'overview'
        });

        $stateProvider.state('directions', {
            url: '/routing/directions',
            templateUrl: 'scripts/views/routing/directions/directions-partial.html',
            controller: 'DirectionsController',
            controllerAs: 'directions'
        });

        $stateProvider.state('changeroute', {
            url: '/routing/changeroute?origin&destination',
            templateUrl: 'scripts/views/routing/changeroute/changeroute-partial.html',
            controller: 'ChangeRouteController',
            controllerAs: 'change'
        });
        $stateProvider.state('goforwalk', {
            url: '/routing/walk',
            templateUrl: 'scripts/views/routing/goforwalk/goforwalk-partial.html',
            controller: 'WalkController',
            controllerAs: 'walk'
        });
    }

    angular.module('nih.views.routing', [
        'ngAria',
        'ui.router',
        'leaflet-directive',
        'ngGeolocation',
        'nih.profiles',
        'nih.mapping',
        'nih.routing',
        'nih.views.navbar',
        'nih.views.optionsgrid'
    ]).config(StateConfig);
})();