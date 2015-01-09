(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('navigate', {
            url: '/navigate',
            templateUrl: 'scripts/views/navigate/navigate-partial.html',
            controller: 'NavigateController',
            controllerAs: 'navigate'
        });
    }

    angular.module('nih.views.navigate', [
        'ngAria',
        'leaflet-directive',
        'nih.profiles',
        'nih.mapping',
        'nih.routing',
        'nih.navigation',
        'nih.views.navbar'
    ]).config(StateConfig);
})();
