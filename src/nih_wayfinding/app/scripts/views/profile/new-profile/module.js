(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('newprofile', {
            url: '/',
            templateUrl: 'scripts/views/profile/new-profile/new-profile-partial.html',
            controller: 'NewProfileController',
            controllerAs: 'newprofile'
        });
    }

    angular.module('nih.views.newprofile', [
        'ngAria',
        'ui.router',
        'nih.profiles',
        'nih.views.navbar'
    ])
    .config(StateConfig);
})();
