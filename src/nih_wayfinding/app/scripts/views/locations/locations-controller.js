(function () {
    'use strict';

    /* ngInject */
    function LocationsController($state, Geocoder, NavbarConfig, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.search = search;
            ctl.searchText = '';
            ctl.suggest = Geocoder.suggest;

            var usernames = ProfileService.getProfileNames();
            var title = usernames.length ? usernames[0] : 'Profile';
            NavbarConfig.set({ title: title});
        }

        function search() {
            Geocoder.search(ctl.searchText).then(function (data) {
                loadRoute(data[0]);
            });
        }

        function loadRoute(feature) {
            var destination = [
                feature.geometry.x,
                feature.geometry.y
            ].join(',');
            $state.go('routing', {destination: destination});
        }
    }

    angular.module('nih.views.locations')
    .controller('LocationsController', LocationsController);

})();