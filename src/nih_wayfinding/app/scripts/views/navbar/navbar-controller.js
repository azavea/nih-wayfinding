(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController($scope, $timeout, NavbarConfig) {
        var ctl = this;
        var defaultAlertHeight = 50;
        var alertTimeout = null;
        initialize();

        function initialize() {
            ctl.config = NavbarConfig.config;
            ctl.alert = {};
            ctl.hideAlert = hideAlert;
            ctl.alertHeight = 0;

            $scope.$on('nih.notifications.hide', hideAlert);
            $scope.$on('nih.notifications.show', showAlert);
        }

        function showAlert(event, alert) {
            ctl.alert = alert;
            ctl.alertHeight = defaultAlertHeight;
            if (alert.timeout) {
                alertTimeout = $timeout(hideAlert, alert.timeout);
            }
        }

        function hideAlert() {
            ctl.alertHeight = 0;
            if (alertTimeout) {
                $timeout.cancel(alertTimeout);
                alertTimeout = null;
            }
        }
    }

    angular.module('nih.views.navbar')
    .controller('NavbarController', NavbarController);

})();