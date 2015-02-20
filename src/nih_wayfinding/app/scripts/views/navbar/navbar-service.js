
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
