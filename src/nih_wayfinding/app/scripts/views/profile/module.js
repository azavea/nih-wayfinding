(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('profiles', {
            url: '/',
            templateUrl: 'scripts/views/profile/profiles-partial.html',
            controller: 'ProfilesController',
            controllerAs: 'profiles'
        });
    }

    angular.module('nih.views.profile', [
        'ngAnimate',
        'ngAria',
        'ui.router',
        'nih.profiles',
        'nih.views.navbar',
        'nih.views.modals'
    ])
    .config(StateConfig);
})();
