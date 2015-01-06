(function () {
    'use strict';

    /* ngInject */
    function LocationsController($state, Geocoder) {
        var ctl = this;

        ctl.name = 'Locations List';
        ctl.search = search;
        ctl.searchText = '';
        ctl.suggest = Geocoder.suggest;

        function search() {
            Geocoder.search(ctl.searchText).then(function (data) {
                loadRoute(data[0]);
            });
        }

        function loadRoute(feature) {
            console.log(feature);
            // TODO: Create routing state which takes start/end lat/lon pairs
            //          as view parameters
            // TODO: Get current location from user to use as start lat/lon
            //$state.go('routing');
        }
    }

    angular.module('nih.views.locations')
    .controller('LocationsController', LocationsController);

})();