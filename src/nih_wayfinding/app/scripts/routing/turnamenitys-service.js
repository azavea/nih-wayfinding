
(function () {
    'use strict';

    /* ngInject */
    function TurnAmenitys ($http) {

        var overpassUrl = 'http://overpass-api.de/api/interpreter';

        var module = {
            get: get,
            attach: attach
        };

        return module;

        function overpassQuery(x, y) {
            var meters = 75;
            var q = '[out:json];' +
                    'node(around:' + meters +
                    ',' + y +
                    ',' + x +
                    ')' +
                    '[amenity][name][amenity!="bicycle_rental"];' +
                    'out;';
            return q;
        }

        /**
         * Look up an amenity from OpenStreetMap to add to the turn by turn
         * directions. Returns a promise.
         *
         * @param x longitude
         * @param y latitude
         */
        function get(x, y) {

            return $http.get(overpassUrl, {
                params: {
                    'data': overpassQuery(x, y)
                }
               // headers: {
               //     'Origin': 'http://localhost:8001/'
               // }
            }).then(function (data) {
                if(data.data.elements.length === 0) {
                    return null;
                }
                return _.first(data.data.elements);
            });
        }

        /**
         * Asynchronously attach OSM amenity to LineString based on the
         * first coordinate
         *
         * @param geojson
         */
        function attach(geojson) {
            _.chain(geojson.features)
                .filter(function (feature) {
                    return feature.geometry.type === 'LineString';
                })
                .forEach(function (feature) {
                    var coords = _.first(feature.geometry.coordinates);
                    get(coords[0], coords[1]).then(function (amenity) {
                        feature.properties.turnamenity = amenity;
                    });
                });
        }
    }

    angular.module('nih.routing')
    .factory('TurnAmenitys', TurnAmenitys);

})();
