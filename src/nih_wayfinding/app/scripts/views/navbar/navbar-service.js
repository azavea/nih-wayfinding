
(function () {
    'use strict';

    /* ngInject */
    function NavbarConfig ($rootScope) {
        var config = {
            title: '',
            subtitle: '',
            rightButton: {
                imgclass: 'caret',
                text: 'Menu'
            }
        };
        var events = {
            updated: 'nih.navbarconfig.updated'
        };

        var module = {
            config: config,
            events: events,
            set: set
        };

        return module;

        function set(options) {
            angular.extend(config, options);
            $rootScope.$broadcast(events.updated);
        }
    }

    angular.module('nih.views.navbar')
    .factory('NavbarConfig', NavbarConfig);

})();
