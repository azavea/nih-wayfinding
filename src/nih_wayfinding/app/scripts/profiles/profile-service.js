
(function () {
    'use strict';

    /* ngInject */
    function ProfileService (ProfileProvider, localStorageService) {

        // private variables
        var currentUser = getProfile(localStorage.getItem('mostCurrentUser')) || {};

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
            currentUser = getProfile(localStorage.getItem('mostCurrentUser')) || {};
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
                localStorage.setItem('mostCurrentUser', name); // Save state for page refresh
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
