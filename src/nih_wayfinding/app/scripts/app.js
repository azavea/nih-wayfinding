(function () {
    'use strict';

    /* ngInject */
    function DefaultRoutingConfig($urlRouterProvider, localStorageServiceProvider) {

        // set up local storage
        localStorageServiceProvider
            .setPrefix('nih')
            .setStorageType('localStorage')
            .setNotify(false, false);

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
        'nih.views.locations'
    ]).config(DefaultRoutingConfig);

})();
