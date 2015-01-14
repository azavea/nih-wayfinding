(function () {
    'use strict';

    /* ngInject */
    function UserLocations(UserLocationsStub, localStorageService, ProfileService) {

        var workingLocation;
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

        function locationsForUser() {
            var user = ProfileService.getCurrentUser();
            var userLocations = user.locations || [];
            return UserLocationsStub.concat(userLocations);
        }

        function createLocationID() {
            var user = ProfileService.getCurrentUser();
            var locationList = user.locations === 'undefined' ? [] : user.locations;
            var maxID = _.max(locationList, function(loc) { return loc.id; }).id;
            var newID = isNaN(maxID) ? 1 : maxID + 1;
            return newID;
        }

        function newLocation() {
            var newID = createLocationID();
            return { id: newID };
        }

        function getLocationByID(id) {
            var user = ProfileService.getCurrentUser();
            if (user && user.locations) {
                var location = _.filter(user.locations, function(loc) {
                    return loc.id === id;
                });
                return location[0];
            }
        }

        function addLocation(location) {
            var user = ProfileService.getCurrentUser();
            var oldLocations = user.locations || [];
            console.log(oldLocations);
            console.log(user.locations);
            console.log(location);

            // Store new value
            user.locations = oldLocations.concat(location);
            workingLocation = undefined;
            localStorageService.set(user.username, user);
        }

        // Specify username here for safety's sake and in case we ever need to delete
        // locations of another user
        function removeLocation(username, id) {
            // Grab user data
            var user = localStorageService.get(username);
            var oldLocations = typeof user.locations === 'undefined' ? [] : user.locations;
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
