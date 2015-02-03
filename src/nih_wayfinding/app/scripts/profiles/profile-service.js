
(function () {
    'use strict';

    /* ngInject */
    function ProfileService (ProfileProvider, localStorageService) {

        // private variables
        var currentUser = ProfileProvider.deserialize((localStorageService.get('lastUser')));

        // Public Interface
        var module = {
            fetchProfile: fetchProfile,
            profileExists: profileExists,
            getProfileNames: getProfileNames,
            createBlankProfile: createBlankProfile,
            deleteProfile: deleteProfile,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            setCurrentUserProperty: setCurrentUserProperty
        };

        return module;

        /**
         * Unset the currentUser
         */
        function deleteCurrentUser() {
            currentUser = {};
        }

        /**
         * Get the currently active user.
         *
         * @returns Profile object for selected user
         */
        function getCurrentUser() {
            currentUser = fetchProfile(localStorageService.get('lastUser'));
            return currentUser;
        }

        /**
         * Changes the currently active user.
         *
         * @param name {String} User name to set
         */
        function setCurrentUser(name) {
            var user = fetchProfile(name);
            if (user) {
                currentUser = user;
                localStorageService.set('lastUser', name); // Save state for page refresh
            } else {
                console.error('User ' + name + ' does not exist!  Not setting current user.');
            }
        }

        /**
         * Sets a property on the currently active user and saves it to local storage.
         *
         * @param property {String} Name of the property to set
         * @param value {Object} Value to set the property to
         */
         function setCurrentUserProperty(property, value) {
            currentUser[property] = value;
            localStorageService.set(currentUser.username, currentUser);
         }

        /**
         * Return an empty user object
         */
        function createBlankProfile() {
            return ProfileProvider.deserialize();
        }

        /**
         * Find profile by name in localstorage
         *
         * @param name {string} username
         * @return {object} The user object, deserialized
         */
        function fetchProfile(name) {
            return ProfileProvider.deserialize(localStorageService.get(name));
        }

        /**
         * Helper method to check on existence of a given profile
         *
         * @param name {string} username
         * @return {boolean} Whether or not a given user exists and persists
         */
        function profileExists(name) {
            return localStorageService.get(name) ? true : false;
        }

        /**
         * Delete the user profile for a given user
         * Unsets currentUser if the current user is the one being deleted
         *
         * @param  {string} name username of the profile to delete
         */
        function deleteProfile(name) {
            if (currentUser.username === name) {
                deleteCurrentUser();
            }
            localStorageService.remove(name);
        }

        /**
         * @returns Array of usernames
         */
        function getProfileNames() {
            return localStorageService.keys();
        }

    }

    angular.module('nih.profiles')
    .factory('ProfileService', ProfileService);

})();
