
(function () {
    'use strict';

    /* ngInject */
    function ProfileService (Config, ProfileProvider, localStorageService) {

        // private variables
        // It is important that the lastUser entry be namespaced differently (hence not using the localStorageService)
        //  so that it isn't confused for a user, itself.
        var currentUser = ProfileProvider.deserialize((localStorage.getItem('lastUser')));

        // Public Interface
        var module = {
            fetchProfile: fetchProfile,
            profileExists: profileExists,
            getProfileNames: getProfileNames,
            createNewProfile: createNewProfile,
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
            currentUser = fetchProfile(localStorage.getItem('lastUser'));
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
                localStorage.setItem('lastUser', name); // Save state for page refresh
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
         * Return a new user object prepopulated with default settings
         */
        function createNewProfile() {
            var user = ProfileProvider.deserialize();
            user = Config.defaultUserSettings;
            /*
            var settings = Config.defaultUserSettings;
            angular.forEach(Config.defaultUserSettings, function(value, key) {
                user[key] = value;
            });
            */
            user.save();
            localStorageService.set(Config.defaultUserSettings.username, user);
            return user;
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
