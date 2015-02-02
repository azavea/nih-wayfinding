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
            ctl.searchText = '';
            // ctl.suggest = Geocoder.suggest;
            ctl.suggest = suggest;

            var title = ctl.user.username ? ctl.user.username : 'Profile';
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

        function suggest(suggestText) {
            return Geocoder.suggest(suggestText).then(function (data) {
                return _.map(ctl.user.searchLocations(suggestText), function (loc) {
                    return loc.text;
                }).concat(data);
            });
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
