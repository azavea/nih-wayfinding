(function () {
    'use strict';

    var ReportingOptions = [{
        text: 'Sidewalk',
    }, {
        text: 'Light',
    }, {
        text: 'Incomplete Data',
    }, {
        text: 'Traffic',
    }, {
        text: 'Scenic',
    }, {
        text: 'More Options',
    }];

    angular.module('nih.routing')
    .constant('ReportingOptions', ReportingOptions);

})();
