
(function () {
    'use strict';

    /* ngInject */
    function NavbarConfig ($rootScope) {

        var colors = {
            default: '#000',
            profile: '#9A9A9A',
            routing: '#9E5C28',
            reroute: '#00C3A6',
            navigation: '#38769F'
        };
        var config = {
            title: '',
            subtitle: '',
            leftImage: '',
            color: colors.default,
            rightImages: [],
            rightButton: {
                imgclass: 'caret',
                text: 'Menu'
            }
        };
        var events = {
            updated: 'nih.navbarconfig.updated'
        };

        var module = {
            colors: colors,
            config: config,
            events: events,
            set: set
        };

        return module;

        function set(options) {
            var defaults = {
                subtitle: '',
                leftImage: '',
                rightImages: [],
                color: colors.default,
                back: true      // display back button to prev view if true, display menu if false
            };
            angular.extend(config, defaults, options);
            $rootScope.$broadcast(events.updated);
        }
    }

    angular.module('nih.views.navbar')
    .factory('NavbarConfig', NavbarConfig);

})();
