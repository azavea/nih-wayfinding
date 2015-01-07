(function () {
    'use strict';

    /* ngInject */
    function ProfilesController(NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        /**
         * Change the currently selected user
         *
         * @param name {String} Username to switch to
         */
        function changeUser(name) {
            ProfileService.setCurrentUser(name);
            setCurrentUser();
        }

        /**
         * Private helper function to set the current user on scope and in title bar
         */
        function setCurrentUser() {
            ctl.currentUser = ProfileService.getCurrentUser();
            var title = ctl.currentUser.username ? ctl.currentUser.username : 'Profile';
            NavbarConfig.set({ title: title});
        }

        function initialize() {
            ctl.changeUser = changeUser;
            ctl.usernames = ProfileService.getProfileNames();
            setCurrentUser();
        }
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
