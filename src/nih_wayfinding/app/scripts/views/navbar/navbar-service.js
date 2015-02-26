
(function () {
    'use strict';

    /* ngInject */
    function NavbarConfig ($rootScope) {

        var colors = {
            default: '#1a1b27',
            profile: '#9e8c66',
            routing: '#406A90',
            reroute: '#C5A960',
            navigation: '#1D8760'
        };
        var defaults = {
            title: '',
            subtitle: '',
            leftImage: '',
            rightButton: {
                text: 'Menu',
                imgclass: 'caret',
                dropdown: true
            },
            color: colors.default,
            back: true      // display back button to prev view if true, display menu if false
        };
        var config = angular.extend({}, defaults);
        var events = {
            buttonclicked: 'nih.navbarconfig.rightbuttonclicked',
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
            angular.extend(config, defaults, options);
            $rootScope.$broadcast(events.updated);
        }
    }

    angular.module('nih.views.navbar')
    .factory('NavbarConfig', NavbarConfig);

})();
