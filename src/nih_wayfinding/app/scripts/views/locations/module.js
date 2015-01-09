(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('locations', {
            url: '/locations',
            templateUrl: 'scripts/views/locations/locations-partial.html',
            controller: 'LocationsController',
            controllerAs: 'locations'
        });
    }

    angular.module('nih.views.locations', [
        'ngAria',
        'ui.router',
        'nih.geocoder',
        'nih.profiles',
        'nih.views.navbar',
        'nih.views.optionsgrid'
    ])
    .config(StateConfig);
})();
