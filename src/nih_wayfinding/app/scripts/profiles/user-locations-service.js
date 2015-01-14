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

        var workingLocation = null;
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
            newLocation: newLocation,
            workingLocation: workingLocation,
            locationsForUser: locationsForUser,
            addLocation: addLocation,
            removeLocation: removeLocation,
            getLocationByID: getLocationByID
        };
        return module;

        /**
         * Return all locations for a user
         * @return {array} Array of locations
         */
        function locationsForUser() {
            var user = ProfileService.getCurrentUser();
            var userLocations = user.locations || [];
            return UserLocationsStub.concat(userLocations);
        }

        /**
         * Create an iterated location ID for a given user
         * @return {int}
         */
        function createLocationID() {
            var user = ProfileService.getCurrentUser();
            var locationList = user.locations || [];
            var maxID = _.max(locationList, function(loc) { return loc.id; }).id;
            var newID = isNaN(maxID) ? 1 : maxID + 1;
            return newID;
        }

        /**
         * Create a base location object with an incremented ID
         * @return {object}
         */
        function newLocation() {
            var newID = createLocationID();
            return { id: newID };
        }

        /**
         * Get a specific location by id
         * @param id {int}
         * @return {object} A location object
         */
        function getLocationByID(id) {
            var user = ProfileService.getCurrentUser();
            if (user && user.locations) {
                var location = _.filter(user.locations, function(loc) {
                    return loc.id === id;
                });
                return location[0];
            }
        }

        /**
         * Add the current workingLocation to the currentUser's locations
         * @param location {object} A location object
         * @return undefined
         */
        function addLocation(location) {
            module.workingLocation = null;
            var user = ProfileService.getCurrentUser();
            var oldLocations = user.locations || [];

            // Store new value
            user.locations = oldLocations.concat(location);
            localStorageService.set(user.username, user);
        }

        // Specify username here for safety's sake and in case we ever need to delete
        // locations of another user
        /**
         * Specify a username and id here and it will be deleted
         * @param username {string}
         * @param id {int}
         * @return undefined
         */
        function removeLocation(username, id) {
            // Grab user data
            var user = localStorageService.get(username);
            var oldLocations = user.locations === undefined ? [] : user.locations;
            // Remove matching on ID
            var newLocations = _.filter(oldLocations, function(loc) { return loc.id !== id; });
            user.locations = newLocations;
            // Store Val
            localStorageService.set(username, user);

        }

    }

    angular.module('nih.profiles')
    .factory('UserLocations', UserLocations);

})();
