(function () {
    'use strict';

    /* ngInject */
    function WalkController($state, $stateParams, NavbarConfig) {
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
            }];
            ctl.optionClicked = optionClicked;

            NavbarConfig.set({title: 'Take a Walk'});
        }

        function optionClicked(option) {
            $state.go('routing', {walkTimeMins: option.walkTimeMins});
        }
    }

    angular.module('nih.views.routing')
    .controller('WalkController', WalkController);

})();