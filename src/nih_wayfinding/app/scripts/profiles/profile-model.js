/**
 * Provider for profile model.
 *
 * See here for example of factory service returning instances:
 * https://github.com/angular/angular.js/issues/1011#issuecomment-7114713
 */
(function () {
    'use strict';

    /* ngInject */
    function ProfileProvider (localStorageService) {
        var Profile = function(obj) {
            if (obj.username) {
                this.username = obj.username;
                this.locations = obj.locations || [];
                this.preferences = obj.preferences || {};
                this.tempLocation = obj.tempLocation || null;
                this.transient = false;
            } else {
                this.username = '';
                this.locations = [];
                this.preferences = {};
                this.tempLocation = obj.tempLocation || null;
                this.transient = true;
            }
            return this;
        };

        /**
         * Governs the persistence in localstorage of the object on which this method is called
         */
        Profile.prototype.save = function() {
            if (this.transient && localStorageService.get(this.username)) {
                return false;
            }
            this.transient = false;
            localStorageService.set(this.username, this);
            return true;
        };

        /**
         * Sets a user preference
         *
         * @param property {string} key
         * @param value {any} value
         */
        Profile.prototype.setPreference = function(property, value) {
            this.preferences[property] = value;
        };

        /**
         * Sets top-level user property
         *
         * @param property {string} key
         * @param value {any} value
         */
        Profile.prototype.setProperty = function(property, value) {
            this[property] = value;
        };

        // Location methods
        /**
        * Begin a new location's construction - save, temporarily, in obj.tempLocation
        */
        Profile.prototype.startTempLocation = function() {
            this.tempLocation = {
                id: this.newLocationID(),
                text: null,
                img: null,
                feature: null,
                address: null,
                type: null
            };
        };

        /**
         * Generate the next location ID
         */
        Profile.prototype.newLocationID = function() {
            var maxID = _.max(this.locations, function(location) { return location.id; }).id;
            return maxID > 0 ? maxID + 1 : 1;
        };

        /**
        * Finish a new location's construction - move tempLocation into locations list and clear it
        */
        Profile.prototype.finishTempLocation = function() {
            this.locations = this.locations.concat(this.tempLocation);
            this.tempLocation = null;
        };

        /**
         * Sets a property on obj.tempLocation user property
         *
         * @param property {string} key
         * @param value {any} value
         */
        Profile.prototype.setTempLocationProperty = function(property, value) {
            this.tempLocation[property] = value;
        };

        /**
        * Find a location
        *
        * @param id {int} The location ID
        * @return {object} The location object found
        */
        Profile.prototype.locationByID = function(id) {
            var location = _.filter(this.locations, function(loc) {
                return loc.id === id;
            });
            return location[0];
        };

        /**
        * Remove a location
        *
        * @param id {int} The location ID
        */
        Profile.prototype.removeLocation = function(id) {
            var newLocations = _.filter(this.locations, function(loc) { return loc.id !== id; });
            this.locations = newLocations;
        };

        /**
         * Get the walk distance for this user given a walk time in minutes
         * @param  {Number} walkTimeMins Time this profile would walk for, in minutes
         * @return {Number} Walk distance in km for the given time
         */
        Profile.prototype.getWalkDistance = function(walkTimeMins) {
            var speed = this.preferences.speed; // m/s
            var seconds = walkTimeMins * 60;
            return  speed * seconds / 1000;
        };


        // Public Interface
        var module = {
            deserialize: deserialize
        };

        return module;

        // encapsulate `new` call
        function deserialize(obj) {
            return new Profile(obj || {});
        }
    }

    angular.module('nih.profiles')
    .factory('ProfileProvider', ProfileProvider);

})();
