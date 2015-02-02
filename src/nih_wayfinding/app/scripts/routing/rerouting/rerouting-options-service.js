(function () {
    'use strict';

    /* ngInject */
    function Rerouting(ReroutingOptions, Config, AmenitiesSearch, Notifications) {
        // Rough guesses at how to find an amenity of this type nearby
        var googleAmenityTypes = {
            Bathroom: ['cafe', 'department_store', 'gas_station',
                       'grocery_or_supermarket', 'shopping_mall', 'restaurant'],
            Bench: ['bank', 'book_store', 'cafe', 'food', 'church', 'park', 'restaurant',
                    'school', 'transit_station'],
        };

        var preReroute = null;
        var module = {
            getReroutingOptions: getReroutingOptions,
            reroute: reroute,
            preReroute: preReroute
        };
        return module;

        function getReroutingOptions() {
            return ReroutingOptions;
        }

        function reroute(preference) {
            // TODO: Update this when location mocking is in place
            var currentLocation = [41.72866461875987,-87.56206512451172];
            var searchRadius = Config.nearbySearchRadius;
            var searchOptions = {types: googleAmenityTypes[preference]};
            return AmenitiesSearch.searchNearby(currentLocation, searchRadius, searchOptions);
        }
    }

    angular.module('nih.routing')
    .factory('Rerouting', Rerouting);

})();
