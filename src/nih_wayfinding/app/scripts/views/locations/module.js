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
        'ui.router'
    ])
    .config(StateConfig);
})();
