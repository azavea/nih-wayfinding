
(function () {
    'use strict';

    /* ngInject */
    function TurnAmenities ($http, $q, AmenitiesSearch) {

        var radiusMeters = 50;  // radius around point to search
        var types = [
            'bank', 'book_store', 'cafe', 'department_store', 'gas_station',
            'grocery_or_supermarket', 'shopping_mall', 'food', 'church', 'park',
            'restaurant', 'school', 'transit_station'
        ];

        var module = {
            get: get,
            attach: attach
        };

        return module;

        /**
         * Look up an amenity from Google Places to add to the turn by turn
         * directions. Promise resolves with a Places object.
         *
         * @param x longitude
         * @param y latitude
         */
        function get(x, y) {
            return AmenitiesSearch.searchNearby([y, x], radiusMeters, {
                types: types
            });
        }

        /**
         * Asynchronously attach OSM amenity to LineString based on the
         * first coordinate
         *
         * @param geojson
         */
        function attach(geojson) {
            var promises = [];
            _.chain(geojson.features)
                .filter(function (feature) {
                    return feature.geometry.type === 'LineString';
                })
                .forEach(function (feature) {
                    var coords = _.first(feature.geometry.coordinates);
                    promises.push(
                        get(coords[0], coords[1]).then(function (amenities) {
                            var amenity = _.first(amenities);
                            feature.properties.turnamenity = amenity;
                            return amenity;
                        })
                    );
                });
            return $q.all(promises);
        }
    }

    angular.module('nih.routing')
    .factory('TurnAmenities', TurnAmenities);

})();
