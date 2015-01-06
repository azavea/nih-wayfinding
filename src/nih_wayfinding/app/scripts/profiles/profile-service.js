
(function () {
    'use strict';

    /* ngInject */
    function ProfileService (ProfileProvider) {

        // Private variables
        var profilesList = [];

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
            return _.find(profilesList, function(obj) { return obj.username === name; });
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
            profilesList.push(profile);
            return profile;
        }

        /**
         * @returns Array of usernames
         */
        function getProfileNames() {
            return _.pluck(profilesList, 'username');
        }

    }

    angular.module('nih.profiles')
    .factory('ProfileService', ProfileService);

})();
