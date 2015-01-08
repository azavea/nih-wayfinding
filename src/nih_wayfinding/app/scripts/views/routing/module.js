(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('routing', {
            url: '/routing?origin&destination',
            templateUrl: 'scripts/views/routing/overview/overview-partial.html',
            controller: 'OverviewController',
            controllerAs: 'overview'
        });

        $stateProvider.state('directions', {
            url: '/directions',
            templateUrl: 'scripts/views/routing/directions/directions-partial.html',
            controller: 'DirectionsController',
            controllerAs: 'directions'
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
        'nih.views.navbar'
    ]).config(StateConfig);
})();