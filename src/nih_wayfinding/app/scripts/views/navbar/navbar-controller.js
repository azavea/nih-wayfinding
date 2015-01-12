(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController($scope, $timeout, $state, NavbarConfig) {
        var ctl = this;
        var defaultAlertHeight = 50;
        var defaultBackState = 'locations';
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

        /**
         * Navigate backwards, with the following logic
         * If config.back === true, use history to get last state
         * If config.back === String, use the value of config.back as the state name to go to
         * Default navigate in all other cases to defaultBackState
         */
        function back() {
            var stateName;
            if (ctl.config.back === true && history.length > 1) {
                // Get the last two states from the history array
                //  [0] is last state, [1] is current state
                // and return the state name
                stateName = history.splice(-2)[0].name;
            } else if (_.isString(ctl.config.back)) {
                stateName = ctl.config.back;
            } else {
                stateName = defaultBackState;
            }
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