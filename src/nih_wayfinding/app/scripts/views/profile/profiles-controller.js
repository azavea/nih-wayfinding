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
            var title = ctl.usernames.length ? ctl.usernames[0] : 'Profile';
            NavbarConfig.set({ title: title});
        }
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
