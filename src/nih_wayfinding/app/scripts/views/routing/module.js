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
    }

    angular.module('nih.views.routing', [
        'ngAria',
        'leaflet-directive',
        'ngGeolocation',
        'nih.profiles',
        'nih.mapping',
        'nih.routing',
        'nih.views.navbar'
    ]).config(StateConfig);
})();