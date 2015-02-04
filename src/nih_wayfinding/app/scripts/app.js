(function () {
    'use strict';

    /* ngInject */
    function DefaultRoutingConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    /* ngInject */
    function Initialize($rootScope, Notifications) {
        $rootScope.$on('$stateChangeStart', function () {
            Notifications.hide();
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
