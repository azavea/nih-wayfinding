
(function () {
    'use strict';

    // private variables
    var currentUser = {};

    /* ngInject */
    function ProfileService (ProfileProvider, localStorageService) {

        // Public Interface
        var module = {
            getProfile: getProfile,
            getProfileNames: getProfileNames,
            createProfile: createProfile,
            deleteProfile: deleteProfile,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            setCurrentUserProperty: setCurrentUserProperty
        };

        return module;

        /**
         * Get the currently active user.
         *
         * @returns Profile object for selected user
         */
        function getCurrentUser() {
            return currentUser;
        }

        /**
         * Changes the currently active user.
         *
         * @param name {String} User name to set
         */
        function setCurrentUser(name) {
            var user = getProfile(name);
            if (user) {
                currentUser = user;
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
         * @returns Profile for given username
         */
        function getProfile(name) {
            return localStorageService.get(name);
        }

        /**
         * Creates a new profile with a given user name.
         *
         * @param name {String} Username
         * @returns Profile, or `false` if a profile already exists for that name.
         */
        function createProfile(name) {
            if (getProfile(name)) {
                return false;
            }

            var profile = ProfileProvider.getInstance();
            profile.username = name;
            localStorageService.set(name, profile);
            return profile;
        }

        function deleteProfile(name) {
            alert('Deleted ' + name);
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
