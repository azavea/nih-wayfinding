(function () {
    'use strict';

    /* ngInject */
    function UserLocations(UserLocationsStub, localStorageService, ProfileService) {

        /**
         * TODO: The deserialization being done in angular-localStorage doesn't allow any
         *       obvious way modify how deserialization occurs. As such, we should define
         *       a factory which takes a bare object and returns a userprofile (and move
         *       much of this code to profile-service.js) so that we can define methods
         *       for adding and removing locations from a given user's profile
         */

        /* This is the basic format of a working location
        {
            id: 0, // i.e. an integer-based unique identifier
            type: '', // e.g. cafe, park, school *OPTIONAL*
            text: '', // e.g. 'Martha's house'
            img: '', // e.g. 'glyphicon-letter' *OPTIONAL*
            address: '', // e.g. 'Cathedral of Learning, Pittsburgh' or '1234 Main Street' *OPTIONAL*
            feature: {} // i.e. geojson feature
        }
        */
        var module = {
        };
        return module;

    }

    angular.module('nih.profiles')
    .factory('UserLocations', UserLocations);

})();
