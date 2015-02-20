(function () {
    'use strict';

    /* ngInject */
    function Rerouting(ReroutingOptions, Config, AmenitiesSearch) {
        // Rough guesses at how to find an amenity of this type nearby
        var googleAmenityTypes = {
            Bathroom: ['cafe', 'department_store', 'gas_station',
                       'grocery_or_supermarket', 'shopping_mall', 'restaurant'],
            Bench: ['bank', 'book_store', 'cafe', 'food', 'church', 'park', 'restaurant',
                    'school', 'transit_station'],
        };

        var module = {
            getReroutingOptions: getReroutingOptions,
            lastChoice: '',
            reroute: reroute
        };
        return module;

        function getReroutingOptions() {
            return ReroutingOptions;
        }

        function reroute(searchPosition, preference) {
            var searchRadius = Config.nearbySearchRadius;
            var searchOptions = {types: googleAmenityTypes[preference]};
            return AmenitiesSearch.searchNearby(searchPosition, searchRadius, searchOptions);
        }
    }

    angular.module('nih.routing')
    .factory('Rerouting', Rerouting);

})();
