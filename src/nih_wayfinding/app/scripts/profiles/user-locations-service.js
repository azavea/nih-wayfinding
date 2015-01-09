(function () {
    'use strict';

    /* ngInject */
    function UserLocations(UserLocationsStub) {

        var module = {
            locationsForUser: locationsForUser
        };
        return module;

        function locationsForUser(username) {
            // STUB
            return UserLocationsStub;
        }
    }

    angular.module('nih.profiles')
    .factory('UserLocations', UserLocations);

})();
