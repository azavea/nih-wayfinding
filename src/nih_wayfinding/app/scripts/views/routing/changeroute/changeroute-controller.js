
(function () {
    'use strict';

    /* ngInject */
    function ChangeRouteController ($state, $stateParams, NavbarConfig) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.options = [{
                text: 'Shorter Route'
            }, {
                text: 'Longer Route'
            }, {
                text: 'More Scenic'
            }, {
                text: 'More Shopping'
            }];
            ctl.optionClicked = optionClicked;

            NavbarConfig.set({title: 'Change Route'});
        }

        function optionClicked(option) {
            // TODO: Handle/test option logic when we actually have some concrete options to handle
            $state.go('routing', $stateParams);
        }
    }

    angular.module('nih.views.routing')
    .controller('ChangeRouteController', ChangeRouteController);

})();
