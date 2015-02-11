(function () {
    'use strict';

    /* ngInject */
    function WalkController($state, $stateParams, Modals, NavbarConfig, Notifications) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.options = [{
                text: '15 minutes',
                walkTimeMins: 15
            }, {
                text: '30 minutes',
                walkTimeMins: 30
            }, {
                text: '45 minutes',
                walkTimeMins: 45
            }, {
                text: '1 hour',
                walkTimeMins: 60
            }, {
                text: '1 hour and 15 minutes',
                walkTimeMins: 75
            }, {
                text: '1 hour and 30 minutes',
                walkTimeMins: 90
            }, {
                text: 'Other',
                walkTimeMins: 0
            }];
            ctl.optionClicked = optionClicked;

            NavbarConfig.set({
                title: 'Take a Walk',
                color: NavbarConfig.colors.routing
            });
        }

        function handleModalResponse(value) {
            var walkTimeMins = parseInt(value, 10);
            if (isNaN(walkTimeMins)) {
                Notifications.show({
                    timeout: 2000
                });
            } else {
                $state.go('routing', {walkTimeMins: walkTimeMins});
            }
        }

        function optionClicked(option) {
            if (option.walkTimeMins) {
                $state.go('routing', {walkTimeMins: option.walkTimeMins});
            } else {
                Modals.openInput({
                    title: 'Enter walk time',
                    label: 'Walk time in minutes'
                }).result.then(handleModalResponse);
            }
        }
    }

    angular.module('nih.views.routing')
    .controller('WalkController', WalkController);

})();
