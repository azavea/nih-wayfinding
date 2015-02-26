(function () {
    'use strict';

     /* ngInject */
    function RowDetail($compile) {
        // TODO: Animate the row appearing
        var template = [
            '<div class="block" ng-show="visible">',
                '<ul class="list-unstyled">',
                    '<li ng-repeat="feature in item.directions.features">',
                        '<img class="icon-condition" ng-src="{{ ::feature.img }}"> {{ ::feature.note }}',
                    '</li>',
                    '<li ng-repeat="warning in item.directions.warnings">',
                        '<img class="icon-condition" ng-src="{{ ::warning.img }}"> {{ ::warning.note }}',
                    '</li>',
                '</ul>',
            '</div>'
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

            var row = $compile(template)(scope);
            element.find('td:last-child').append(row);

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
