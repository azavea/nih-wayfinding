(function () {
    'use strict';

    /* ngInject */
    function UserLocations(UserLocationsStub, localStorageService, ProfileService) {

        var svcLocation = {
            type: '', // e.g. cafe, park, school
            text: '', // e.g. 'Martha's house'
            img: '', // e.g. 'glyphicon-letter'
            address: '', // e.g. 'Cathedral of Learning, Pittsburgh' or '1234 Main Street'
            feature: {} // i.e. geojson feature
        };
        var module = {
            newLocation: newLocation,
            locationsForUser: locationsForUser,
            setLocationType: setLocationType,
            setLocationText: setLocationText,
            setLocationImg: setLocationImg,
            setLocationAddress: setLocationAddress,
            setLocationFeature: setLocationFeature,
            addLocation: addLocation,
            removeLocation: removeLocation,
            getWorkingLocation: getWorkingLocation,
            getLocationByID: getLocationByID
        };
        return module;

        function locationsForUser() {
            var user = ProfileService.getCurrentUser();
            console.log(user);
            var userLocations = user.locations || [];
            var stubLocations = UserLocationsStub;
            console.log(userLocations.concat(stubLocations));
            // STUB
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
            svcLocation = { id: newID };
        }

        function getWorkingLocation() {
            if (svcLocation.id === undefined) {
                svcLocation.id = createLocationID();
            }
            return svcLocation;
        }

        function getLocationByID(id) {
            var user = ProfileService.getCurrentUser();
            if (user && user.locations) {
                var location = _.filter(user.locations, function(loc) {
                    return loc.id === id;
                });
                return location === [] ? {} : location;
            }
        }

        function setLocationType(type) {
            svcLocation.type = type;
        }

        function setLocationText(text) {
            svcLocation.text = text;
        }

        function setLocationImg(img) {
            svcLocation.img = img;
        }

        function setLocationAddress(address) {
            svcLocation.address = address;
        }

        function setLocationFeature(feature) {
            svcLocation.feature = feature;
        }

        function addLocation() {
            var user = ProfileService.getCurrentUser();
            var oldLocations = typeof user.locations === 'undefined' ? [] : user.locations;
            console.log(oldLocations);

            // Store new value
            user.locations = oldLocations.concat(svcLocation);
            console.log(user);
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
