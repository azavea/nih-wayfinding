
(function () {
    'use strict';

    /* ngInject */
    function Notifications($rootScope, $timeout) {

        var timeoutId = null;

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
            if (timeoutId) {
                $timeout.cancel(timeoutId);
                timeoutId = null;
            }
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
                delay: 0,
                closeButton: true,
                text: '',
                imageClass: 'glyphicon-warning-sign'
            };
            var opts = angular.extend({}, defaults, options);
            timeoutId = $timeout(function () {
                $rootScope.$broadcast('nih.notifications.show', opts);
            }, opts.delay, false);
        }
    }

    angular.module('nih.notifications')
    .factory('Notifications', Notifications);

})();
