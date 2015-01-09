(function () {
    'use strict';

    /* ngInject */
    function ProfilesController(Modals, NavbarConfig, ProfileService) {
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

        function deleteUser(name) {
            Modals.openConfirm({
                text: 'You are about to delete the profile for ' + name + '.',
                confirmClass: 'btn-danger'
            }).result.then(function () {
                ProfileService.deleteProfile(name);
            });
        }

        function onProfileSelect(name) {
            if (ctl.deleteMode) {
                deleteUser(name);
                // handle profile delete
            } else {
                changeUser(name);
            }
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
            ctl.onProfileSelect = onProfileSelect;
            ctl.usernames = ProfileService.getProfileNames();
            setCurrentUser();
        }
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
