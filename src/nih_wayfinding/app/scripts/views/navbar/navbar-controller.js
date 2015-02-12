(function () {
    'use strict';
    // TODO: This should likely be a directive, something like nih-navbar once
    //       we have profiles to link to

    /* ngInject */
    function NavbarController($location, $rootScope, $scope, $state, $timeout, NavbarConfig) {
        var ctl = this;
        var defaultBackState = 'locations';
        var alertTimeout = null;
        var history = [];
        initialize();

        function initialize() {
            ctl.config = NavbarConfig.config;
            ctl.active = false;
            ctl.alert = {};
            ctl.alertHeight = 0;

            ctl.back = back;
            ctl.hideAlert = hideAlert;
            ctl.onRightButtonClicked = onRightButtonClicked;

            $scope.$on('nih.notifications.hide', hideAlert);
            $scope.$on('nih.notifications.show', showAlert);
            $scope.$on('$stateChangeSuccess', function (event, toState, toStateParams) {
                history.push({
                    name: toState.name,
                    params: toStateParams
                });
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
            var stateParams = {};
            if (ctl.config.back === true && history.length > 1) {
                // Get the last two states from the history array
                //  [0] is last state, [1] is current state
                // and return the state name
                var state = history.splice(-2)[0];
                stateName = state.name;
                stateParams = state.params;
            } else if (_.isString(ctl.config.back)) {
                stateName = ctl.config.back;
            } else {
                stateName = defaultBackState;
            }
            $state.go(stateName, stateParams);
        }

        function onRightButtonClicked() {
            $rootScope.$broadcast(NavbarConfig.events.buttonclicked);
        }

        function showAlert(event, alert) {
            ctl.alert = alert;
            ctl.active = true;
            if (alert.timeout) {
                alertTimeout = $timeout(hideAlert, alert.timeout);
            }
        }

        function hideAlert() {
            ctl.active = false;
            if (alertTimeout) {
                $timeout.cancel(alertTimeout);
                alertTimeout = null;
            }
        }
    }

    angular.module('nih.views.navbar')
    .controller('NavbarController', NavbarController);

})();
