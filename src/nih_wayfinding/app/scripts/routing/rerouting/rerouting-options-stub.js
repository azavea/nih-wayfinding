(function () {
    'use strict';

    var ReroutingOptions = [{
        text: 'Bathroom'
    }, {
        text: 'Bench'
    }, {
        text: 'More Options'
    }];

    angular.module('nih.routing')
    .constant('ReroutingOptions', ReroutingOptions);

})();
