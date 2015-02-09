(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('newprofile', {
            url: '/profiles',
            templateUrl: 'scripts/views/profile/new-profile/new-profile-partial.html',
            controller: 'NewProfileController',
            controllerAs: 'newprofile'
        });
    }

    angular.module('nih.views.newprofile', [
        'ngAria',
        'ui.router',
        'nih.profiles',
        'nih.views.navbar',
        'nih.notifications'
    ])
    .config(StateConfig);
})();
