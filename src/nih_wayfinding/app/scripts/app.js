(function () {
    'use strict';

    /* ngInject */
    function DefaultRoutingConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    /* ngInject */
    function Initialize($rootScope, Notifications, ProfileService) {
        $rootScope.$on('$stateChangeStart', function () {
            Notifications.hide();

            // check if there are any extant user profiles; if not, create a default one
            if (!ProfileService.getProfileNames().length) {
                var user = ProfileService.createNewProfile();
                ProfileService.setCurrentUser(user.username);
            }
        });
    }

    /**
    * @ngdoc overview
    * @name nih
    * @description
    * # nih
    *
    * Main module of the application.
    */
    angular.module('nih', [
        'nih.views.navbar',
        'nih.views.profile',
        'nih.views.newprofile',
        'nih.views.locations',
        'nih.views.routing',
        'nih.views.navigate'
    ]).config(DefaultRoutingConfig)
      .run(Initialize);
})();
