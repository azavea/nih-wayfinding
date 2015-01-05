(function () {
    'use strict';

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