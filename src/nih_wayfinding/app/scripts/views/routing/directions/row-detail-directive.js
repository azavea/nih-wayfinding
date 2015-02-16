(function () {
    'use strict';

     /* ngInject */
    function RowDetail($compile, Directions) {
        // TODO: Animate the row appearing
        var template = [
            '<tr ng-show="visible"><td colspan="2">',
                '<ul class="list-unstyled">',
                    '<li ng-repeat="feature in item.directions.features">',
                        '<img width="20px" height="20px" ng-src="{{ ::feature }}" />{{ textForImage(feature) }}',
                    '</li>',
                    '<li ng-repeat="feature in item.directions.warnings">',
                        '<img width="20px" height="20px" ng-src="{{ ::feature }}" />{{ textForImage(feature) }}',
                    '</li>',
                '</ul>',
            '</td></tr>'
        ].join('');

        var module = {
            restrict: 'A',
            scope: false,
            link: link,
        };

        return module;

        function link(scope, element) {

            if (!hasDetails(scope.item)) {
                return;
            }

            scope.visible = false;
            scope.textForImage = Directions.textForImage;

            var row = $compile(template)(scope);
            element.after(row);

            element.click(function () {
                scope.visible = !scope.visible;
                scope.$apply();
            });

            function hasDetails(item) {
                var directions = item.directions;
                return directions && (directions.features.length || directions.warnings.length);
            }
        }
    }

    angular.module('nih.views.routing')
    .directive('rowDetail', RowDetail);

})();