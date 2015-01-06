
(function () {
    'use strict';

    /* ngInject */
    function Geocoder ($http, $q) {

        // Private variables
        var searchUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
        var suggestUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
        var boundingBox = '-87.940101,41.643919,-87.523984,42.023022';  // Defaults to Chicago
        var searchOutFields = 'StAddr,City,Postal';
        var searchCategories = [
            'Address',
            'Postal'
        ].join(',');

        // Public Interface
        var module = {
            search: search,
            suggest: suggest
        };

        return module;

        // Hoisted function definitions

        function search(text) {
            var dfd = $q.defer();
            $http.get(searchUrl, {
                params: {
                    'text': text,
                    'bbox': boundingBox,
                    'category': searchCategories,
                    'outFields': searchOutFields,
                    'maxLocations': 1,
                    'f': 'pjson'
                }
            }).success(function (data) {
                dfd.resolve(searchToList(data));
            }).error(function (data) {
                dfd.resolve([]);
                console.error('Geocoder.search(): ', data);
            });
            return dfd.promise;
        }

        // Helper function transforms response to array of locations
        function searchToList(response) {
            return response.locations;
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
            return _.pluck(response.suggestions, 'text');
        }
    }

    angular.module('nih.geocoder')
    .factory('Geocoder', Geocoder);

})();
