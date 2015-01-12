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
            changeLocationType: changeLocationType,
            changeLocationLabel: changeLocationLabel,
            changeLocationIcon: changeLocationIcon,
            changeLocationAddress: changeLocationAddress,
            addLocation: addLocation,
            removeLocation: removeLocation
        };
        return module;

        function locationsForUser(username) {
            // STUB
            return UserLocationsStub;
        }

        function newLocation() {
            location = {};
        }

        function changeLocationType(type) {
            location.type = type;
        }

        function changeLocationLabel(label) {
            location.label = label;
        }

        function changeLocationIcon(address) {
            location.address = address;
        }

        function changeLocationAddress(address) {
            location.address = address;
        }

        function addLocation(username) {
            var oldValue = localStorage.get('locations');
            var newID = null ? 1 : _.max(oldValue, function(loc) { return loc.id; }).id + 1;
            location.id = newID;
            var newValue = oldValue.concat(svcLocation);
            localStorageService.set('locations', newValue);
        }

        function removeLocation(id) {
            var oldValue = localStorage.get('locations');
            var newValue = _.filter(oldValue, function(loc) { return loc.id !== id; });
            localStorageService.set('locations', newValue);
        }

    }

    angular.module('nih.profiles')
    .factory('UserLocations', UserLocations);

})();
