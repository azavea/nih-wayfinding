
(function () {
    'use strict';

    /* ngInject */
    function NavbarConfig ($rootScope) {
        var config = {
            title: '',
            subtitle: '',
            leftImage: '',
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
            var defaults = {
                subtitle: '',
                leftImage: '',
                back: true      // display back button to prev view if true, display menu if false
            };
            angular.extend(config, defaults, options);
            $rootScope.$broadcast(events.updated);
        }
    }

    angular.module('nih.views.navbar')
    .factory('NavbarConfig', NavbarConfig);

})();
