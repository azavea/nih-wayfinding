(function () {
    'use strict';

    /* ngInject */
    function LocationsController($scope, $state, Geocoder, NavbarConfig, Notifications, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.findAddressExpanded = false;
            ctl.user = ProfileService.getCurrentUser();
            ctl.gridOptions = ctl.user.locations;
            ctl.optionClicked = optionClicked;
            ctl.search = search;
            ctl.suggest = Geocoder.suggest;

            var title = ctl.user.username ? ctl.user.username : 'Profile';
            NavbarConfig.set({
                title: title,
                back: false
            });
        }

        function optionClicked(option) {
            loadRoute(option.feature);
        }

        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey).then(function(data) {
                loadRoute(data[0]);
            }, function(error) {
                Notifications.show({
                    text: error,
                    timeout: 3000
                });
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
