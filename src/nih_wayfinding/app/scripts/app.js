(function () {
    'use strict';

    /* ngInject */
    function DefaultRoutingConfig($urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
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
        'nih.views.routing'
    ]).config(DefaultRoutingConfig);

})();
