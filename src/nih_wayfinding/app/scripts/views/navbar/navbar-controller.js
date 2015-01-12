(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController($scope, $timeout, $state, NavbarConfig) {
        var ctl = this;
        var defaultAlertHeight = 50;
        var alertTimeout = null;
        var history = [];
        initialize();

        function initialize() {
            ctl.config = NavbarConfig.config;
            ctl.alert = {};
            ctl.alertHeight = 0;

            ctl.back = back;
            ctl.hideAlert = hideAlert;

            $scope.$on('nih.notifications.hide', hideAlert);
            $scope.$on('nih.notifications.show', showAlert);
            $scope.$on('$stateChangeSuccess', function (event, toState) {
                history.push(toState);
            });
        }

        function back() {
            var stateName = history.length > 1 ? history.splice(-2)[0].name : 'profiles';
            $state.go(stateName);
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