(function () {
    'use strict';

    /* ngInject */
    function ProfilesController(Modals, NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.onProfileSelect = onProfileSelect;
            refreshUserList();
        }

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
         * Open a modal to confirm user deletion, the delete it and unset the currentUser if necessary
         * @param  {string} name Username of the user to delete
         */
        function deleteUser(name) {
            Modals.openConfirm({
                text: 'You are about to delete the profile for ' + name + '.',
                confirmClass: 'btn-danger'
            }).result.then(function () {
                ProfileService.deleteProfile(name);
                refreshUserList();
            });
        }

        /**
         * Take action on row select, either delete user or set as current user
         * @param  {string} name Username of the user to take action on
         */
        function onProfileSelect(name) {
            if (ctl.deleteMode) {
                deleteUser(name);
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
            NavbarConfig.set({
                title: title,
                back: false
            });
        }

        function refreshUserList() {
            ctl.usernames = ProfileService.getProfileNames();
            setCurrentUser();
        }
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
