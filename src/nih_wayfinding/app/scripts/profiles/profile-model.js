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
            if (obj) {
                this.username = obj.username || '';
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
        Profile.prototype.save = function() {
            if (this.transient && localStorageService.get(this.username)) {
                return false;
            }
            this.transient = false;
            console.log(this.username, this);
            localStorageService.set(this.username, this);
            return true;
        };

        Profile.prototype.setPreference = function(property, value) {
            this.preferences[property] = value;
        };

        Profile.prototype.setProperty = function(property, value) {
            this[property] = value;
        };


        Profile.prototype.newLocationID = function() {
            var maxID = _.max(this.locations, function(location) { return location.id; });
            return maxID > 0 ? maxID + 1 : 1;
        };
        Profile.prototype.clearTemp = function() {
            this.tempLocation = null;
        };
        Profile.prototype.startLocation = function() {
            this.tempLocation = {
                id: this.newLocationID,
                text: null,
                img: null,
                feature: null,
                address: null,
                type: null
            };
        };
        Profile.prototype.finishLocation = function() {
            this.locations = this.locations.concat(this.tempLocation);
            this.clearTemp();
        };
        Profile.prototype.locationByID = function(id) {
            var location = _.filter(this.locations, function(loc) {
                return loc.id === id;
            });
            return location[0];
        };
        Profile.prototype.removeLocation = function(id) {
            var newLocations = _.filter(this.locations, function(loc) { return loc.id !== id; });
            this.locations = newLocations;
        };
        Profile.prototype.extendTempLocation = function(property, value) {
            this.tempLocation[property] = value;
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
