(function () {
    'use strict';

    /* ngInject */
    function UserLocations(UserLocationsStub, localStorageService) {

        var svcLocation = {
            type: '', // e.g. cafe, park, school
            label: '', // e.g. 'Martha's house'
            icon: '', // e.g. 'glyphicon-letter'
            address: '' // e.g. 'Cathedral of Learning, Pittsburgh' or '1234 Main Street'
        };
        var module = {
            newLocation: newLocation,
            locationsForUser: locationsForUser,
            setLocationType: setLocationType,
            setLocationLabel: setLocationLabel,
            setLocationIcon: setLocationIcon,
            setLocationAddress: setLocationAddress,
            addLocation: addLocation,
            removeLocation: removeLocation,
            getLocationID: getLocationID
        };
        return module;

        function locationsForUser(username) {
            // STUB
            return UserLocationsStub;
        }

        function newLocation(username) {
            // Grab user data
            var user = localStorageService.get(username);
            var oldLocations = typeof user.locations === 'undefined' ? [] : user.locations;
            // Handle ID
            var maxID = _.max(oldLocations, function(loc) { return loc.id; }).id;
            var newID = isNaN(maxID) ? 1 : maxID + 1;
            svcLocation = { id: newID };
        }

        function getLocationID() {
            return svcLocation.id;
        }

        function setLocationType(type) {
            svcLocation.type = type;
        }

        function setLocationLabel(label) {
            svcLocation.label = label;
        }

        function setLocationIcon(address) {
            svcLocation.address = address;
        }

        function setLocationAddress(address) {
            svcLocation.address = address;
        }

        function addLocation(username) {
            // Grab user data
            var user = localStorageService.get(username);
            var oldLocations = typeof user.locations === 'undefined' ? [] : user.locations;

            // Store new value
            user.locations = oldLocations.concat(svcLocation);
            localStorageService.set(username, user);
        }

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
