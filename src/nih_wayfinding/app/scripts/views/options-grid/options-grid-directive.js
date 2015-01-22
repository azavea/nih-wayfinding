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
     * onOptionClicked should be a function that takes a single argument, which will be the object
     * from the options array that was clicked on.
     *
     * See LocationsController for example usage
     */
    /* ngInject */
    function OptionsGrid() {

        var template = [
            '<div class="options-grid">',
                '<button ng-click="optionClicked(option)" ng-repeat="option in options" ng-class="{\'btn-img\': option.img}">',
                    '<img ng-if="option.img" ng-src="{{option.img}}"/>',
                    '<div class="btn-img-label">{{ ::option.text }}</div>',
                '</button>',
            '</div>',
        ].join('');

        var module = {
            restrict: 'E',
            scope: {
                options: '=',
                onOptionClicked: '&'
            },
            template: template,
            link: link,
        };

        return module;

        function link(scope) {
            scope.optionClicked = function(option) {
                scope.onOptionClicked({option: option});
            };
        }

    }

    angular.module('nih.views.optionsgrid')
    .directive('nihOptionsGrid', OptionsGrid);

})();
