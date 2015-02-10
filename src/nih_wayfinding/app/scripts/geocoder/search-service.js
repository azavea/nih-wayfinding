
(function () {
    'use strict';

    /* ngInject */
    function Geocoder ($http, $q, MapControl, Config) {

        // Private variables
        var searchUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
        var suggestUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
        var boundingBox = [
            Config.bounds.southWest.lng,
            Config.bounds.southWest.lat,
            Config.bounds.northEast.lng,
            Config.bounds.northEast.lat
        ].join(',');
        var maxResults = 10;
        var searchOutFields = 'StAddr,City,Postal';
        var searchCategories = [
            'Address',
            'Postal',
            'POI'
        ].join(',');

        // Public Interface
        // TODO: Expose the bbox, outFields and categories vars as config options
        var module = {
            /**
             * Perform a geocoder search using some text
             * @param {string} The text string to search
             * @return {array} An array of features, where each feature has an attributes dict and
             *                 and a geometry dict
             */
            search: search,

            /**
             * Perform a geocoder suggest, this is faster than search and should be used e.g. to
             *  to fill an autocomplete search box
             *
             * @param {string} The text string to search
             * @return {array} An array of matching strings that relate to the searched text
             */
            suggest: suggest
        };

        return module;

        // Hoisted function definitions

        function search(text, magicKey) {
            var dfd = $q.defer();
            $http.get(searchUrl, {
                params: {
                    'text': text,
                    'category': searchCategories,
                    'outFields': searchOutFields,
                    'maxLocations': maxResults,
                    'magicKey': magicKey || null,
                    'f': 'pjson'
                }
            }).success(function (data) {
                var response = searchToList(data);
                if (response.length) {
                    // check if location is within graph bounds
                    MapControl.getGraphBounds().then(function(geojson) {
                        var geom = response[0].geometry;
                        // must use turf's geojson-y objects for turf.inside
                        var point = turf.point([geom.x, geom.y]);
                        var polygon = turf.polygon(geojson.coordinates);
                        if (turf.inside(point, polygon)) {
                            dfd.resolve(response);
                        } else {
                            dfd.reject('Address is outside the routing bounds. Please choose a different address.');
                        }
                    });
                } else {
                    dfd.reject('Unable to find the selected address. Please try a different one.');
                }
            }).error(function (error) {
                dfd.reject('Error attempting to geocode address.');
                console.error('Geocoder.search(): ', error);
            });
            return dfd.promise;
        }

        // Helper function transforms response to array of features, where each feature
        //  has an attributes and geometry dict
        function searchToList(response) {
            return _.pluck(response.locations, 'feature');
        }

        function suggest(text) {
            var dfd = $q.defer();
            $http.get(suggestUrl, {
                params: {
                    category: searchCategories,
                    f: 'pjson',
                    searchExtent: boundingBox,
                    text: text
                }
            }).success(function (data) {
                dfd.resolve(suggestToList(data));
            }).error(function (data) {
                dfd.resolve([]);
                console.error('Geocoder.suggest(): ', data);
            });

            return dfd.promise;
        }

        // Helper function transforms response to array of suggested string locations
        function suggestToList(response) {
            return _.map(response.suggestions, function (suggestion) {
                return _.pick(suggestion, ['text', 'magicKey']);
            });
        }
    }

    angular.module('nih.geocoder')
    .factory('Geocoder', Geocoder);

})();
