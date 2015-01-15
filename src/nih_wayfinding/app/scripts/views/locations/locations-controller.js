(function () {
    'use strict';

    /* ngInject */
    function LocationsController($scope, $state, Geocoder, NavbarConfig, Notifications, ProfileService) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.findAddressExpanded = false;
            ctl.currentUser = ProfileService.getCurrentUser();
            ctl.gridOptions = ctl.locations;
            ctl.optionClicked = optionClicked;
            ctl.search = search;
            ctl.searchText = '';
            ctl.suggest = Geocoder.suggest;

            var title = ctl.currentUser.username ? ctl.currentUser.username : 'Profile';
            NavbarConfig.set({
                title: title,
                back: false
            });
        }

        function optionClicked(option) {
            loadRoute(option.feature);
        }

        function onGeocoderResponse(data) {
            if (data && data.length) {
                loadRoute(data[0]);
            } else {
                Notifications.show({
                    text: 'Unable to find the selected address. Please try a different one.',
                    timeout: 3000
                });
            }
        }

        function search(searchText) {
            Geocoder.search(searchText).then(onGeocoderResponse);
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
