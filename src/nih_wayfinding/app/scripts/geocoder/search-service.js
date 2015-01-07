
(function () {
    'use strict';

    /* ngInject */
    function Geocoder ($http, $q, Config) {

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
            'Postal'
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

        function search(text) {
            var dfd = $q.defer();
            $http.get(searchUrl, {
                params: {
                    'text': text,
                    'bbox': boundingBox,
                    'category': searchCategories,
                    'outFields': searchOutFields,
                    'maxLocations': maxResults,
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
            return _.pluck(response.suggestions, 'text');
        }
    }

    angular.module('nih.geocoder')
    .factory('Geocoder', Geocoder);

})();
