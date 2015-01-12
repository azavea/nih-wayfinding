(function () {
    'use strict';

    /* ngInject */
    function SelectTypeController(NavbarConfig) {
        var ctl = this;
        initialize();

        function initialize() {
            NavbarConfig.set({ title: 'Location Type' });
            ctl.gridOptions = [
                { text: 'Cafe' },
                { text: 'House' },
                { text: 'Park' },
                { text: 'Shopping' },
                { text: 'Donut Shop' },
                { text: 'Other' }
            ];
            ctl.optionClicked = optionClicked;
        }

      function optionClicked(option) {
      }

    }

    angular.module('nih.views.locations')
      .controller('SelectTypeController', SelectTypeController);

})();
