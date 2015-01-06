(function () {
    'use strict';

    /* ngInject */
    function ProfilesController(NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ProfileService.createProfile('Donald');
            ProfileService.createProfile('Mickey');
            ProfileService.createProfile('Minnie');

            ctl.usernames = ProfileService.getProfileNames();
            NavbarConfig.set({ title: ctl.usernames[0]});
        }
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
