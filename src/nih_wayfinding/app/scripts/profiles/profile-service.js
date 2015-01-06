
(function () {
    'use strict';

    /* ngInject */
    function ProfileService (ProfileProvider, localStorageService) {

        // Public Interface
        var module = {
            getProfile: getProfile,
            getProfileNames: getProfileNames,
            createProfile: createProfile
        };

        return module;

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
         * @returns Array of usernames
         */
        function getProfileNames() {
            return localStorageService.keys();
        }

    }

    angular.module('nih.profiles')
    .factory('ProfileService', ProfileService);

})();
