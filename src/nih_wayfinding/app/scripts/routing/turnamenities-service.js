
(function () {
    'use strict';

    /* ngInject */
    function TurnAmenities ($http, $q) {

        var overpassUrl = 'http://overpass-api.de/api/interpreter';
        var radiusMeters = 75;  // radius around point to search

        var module = {
            get: get,
            attach: attach
        };

        return module;

        function overpassQuery(x, y) {
            var q = '[out:json];' +
                    'node(around:' + radiusMeters +
                    ',' + y +
                    ',' + x +
                    ')' +
                    '[amenity][name][amenity!="bicycle_rental"];' +
                    'out;';
            return q;
        }

        /**
         * Look up an amenity from OpenStreetMap to add to the turn by turn
         * directions. Promise resolves with an OSM node object.
         *
         * @param x longitude
         * @param y latitude
         */
        function get(x, y) {

            return $http.get(overpassUrl, {
                params: {
                    'data': overpassQuery(x, y)
                }
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
            var promises = [];
            _.chain(geojson.features)
                .filter(function (feature) {
                    return feature.geometry.type === 'LineString';
                })
                .forEach(function (feature) {
                    var coords = _.first(feature.geometry.coordinates);
                    promises.push(
                        get(coords[0], coords[1]).then(function (amenity) {
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
