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
        'ui.bootstrap',
        'nih.views.profile'
    ]).config(DefaultRoutingConfig);

})();
