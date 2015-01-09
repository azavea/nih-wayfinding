(function () {
    'use strict';

    /**
     * Options Grid Directive
     *
     * Takes a list of options, with the form:
     * {
     *     text: 'string',
     *     img: 'string|optional',
     *     feature: {geojson feature}
     * }
     * and displays them in a grid.
     *
     * Events:
     *     'nih.optionsgrid.clicked': event, option
     */
    /* ngInject */
    function OptionsGrid() {

        var templateUrl = 'scripts/views/options-grid/options-grid-partial.html';

        var module = {
            restrict: 'E',
            scope: {
                options: '='
            },
            templateUrl: templateUrl,
            link: link,
        };

        return module;

        function link(scope) {
            scope.onOptionClicked = function(index) {
                scope.$emit('nih.optionsgrid.clicked', scope.options[index]);
            };
        }
    }

    angular.module('nih.views.optionsgrid')
    .directive('nihOptionsGrid', OptionsGrid);

})();
