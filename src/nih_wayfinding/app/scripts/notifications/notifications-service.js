
(function () {
    'use strict';

    /* ngInject */
    function Notifications($rootScope) {

        var module = {
            hide: hide,
            show: show
        };

        return module;

        /**
         * Hide a global notification
         * @return Broadcasts nih.notifications.hide on $rootScope
         */
        function hide() {
            $rootScope.$broadcast('nih.notifications.hide');
        }

        /**
         * Show a global notification, overridding the defaults defined in the function
         * @param  {object} options Override the defaults with this config
         * @return Broadcasts nih.notifications.show on $rootScope
         */
        function show(options) {
            var defaults = {
                timeout: 0,
                closeButton: true,
                text: '',
                imageClass: 'glyphicon-warning-sign'
            };
            var opts = angular.extend({}, defaults, options);
            $rootScope.$broadcast('nih.notifications.show', opts);
        }
    }

    angular.module('nih.notifications')
    .factory('Notifications', Notifications);

})();
