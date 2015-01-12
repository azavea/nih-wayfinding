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

        $stateProvider.state('locationsSelectType', {
            url: '/locations/new/select-type',
            templateUrl: 'scripts/views/locations/add-location/select-type/select-type-partial.html',
            controller: 'SelectTypeController',
            controllerAs: 'locationsSelectType'
        });

        $stateProvider.state('locationsProfile', {
            url: '/locations/:username/:locationID/',
            templateUrl: 'scripts/views/locations/add-location/location-profile/location-profile-partial.html',
            controller: 'LocationsProfileController',
            controllerAs: 'locationsProfile'
        });
    }

    angular.module('nih.views.locations', [
        'ngAria',
        'ui.router',
        'nih.geocoder',
        'nih.notifications',
        'nih.profiles',
        'nih.views.navbar',
        'nih.views.optionsgrid'
    ])
    .config(StateConfig);
})();
