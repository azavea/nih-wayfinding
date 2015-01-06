(function () {
    'use strict';

    function OverviewController(NavbarConfig) {
        NavbarConfig.set({ title: 'Preview Route' });
    }

    angular.module('nih.views.routing')
    .controller('OverviewController', OverviewController);

})();