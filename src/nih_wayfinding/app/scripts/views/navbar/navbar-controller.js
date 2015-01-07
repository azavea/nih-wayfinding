(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController(NavbarConfig) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.config = NavbarConfig.config;
        }
    }

    angular.module('nih.views.navbar')
    .controller('NavbarController', NavbarController);

})();