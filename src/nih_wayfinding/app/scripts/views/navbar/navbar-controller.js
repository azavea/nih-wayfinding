(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController() {
        var ctl = this;

        // TODO: Replace stub with call to Profile service to retrieve current profile
        ctl.profile = {
            name: 'Forrest'
        };
    }

    angular.module('nih.views.navbar')
    .controller('NavbarController', NavbarController);

})();