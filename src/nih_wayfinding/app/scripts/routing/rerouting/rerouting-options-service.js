(function () {
    'use strict';

    /* ngInject */
    function Rerouting(ReroutingOptions) {

        var module = {
            getReroutingOptions: getReroutingOptions
        };
        return module;

        function getReroutingOptions() {
            return ReroutingOptions;
        }
    }

    angular.module('nih.routing')
    .factory('Rerouting', Rerouting);

})();
