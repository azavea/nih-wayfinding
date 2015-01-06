/**
 * Provider for profile model.
 *
 * See here for example of factory service returning instances:
 * https://github.com/angular/angular.js/issues/1011#issuecomment-7114713
 */
(function () {
    'use strict';

    /* ngInject */
    function ProfileProvider () {
        var Profile = function() {};
        Profile.prototype.username = '';

        // Public Interface
        var module = {
            getInstance: getInstance
        };

        return module;

        // encapsulate `new` call
        function getInstance () {
            return new Profile();
        }
    }

    angular.module('nih.profiles')
    .factory('ProfileProvider', ProfileProvider);

})();
