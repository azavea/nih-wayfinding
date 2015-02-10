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
            ctl.toggleDelete = toggleDelete;
            ctl.search = search;
            ctl.suggest = Geocoder.suggest;

            ctl.deleteMode = {
                active: false,
                buttonText: 'Delete'
            };

            var title = ctl.user.username ? ctl.user.username : 'Profile';
            NavbarConfig.set({
                title: title,
                back: false
            });
        }

        function optionClicked(option) {
            if (ctl.deleteMode.active) {
                deleteLocation(option.id);
            } else {
                loadRoute(option.feature);
            }
        }

        function toggleDelete() {
            ctl.deleteMode.active = !ctl.deleteMode.active;
            ctl.deleteMode.buttonText = ctl.deleteMode.active ? 'Finish' : 'Delete';
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

        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey).then(onGeocoderResponse);
        }

        function deleteLocation(locationId) {
            ctl.user.removeLocation(locationId);
            ctl.user.save();
            ctl.gridOptions = ctl.user.locations;       // manually update
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
