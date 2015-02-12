
(function () {
    'use strict';

    /* ngInject */
    function AmenitiesSearch ($q, leafletData, leafletHelpers) {

        // Public interface
        var module = {
            searchNearby: searchNearby
        };

        return module;

        // Internal function implementations
        /**
         * Find nearby amenities to which the user can be re-routed
         * @param point {list} Array containing point coordinates in [lat, lng] order
         * @param radius {number} Search radius around the user's current location
         * @param options {object} Other options to pass to Google Places API.
         * See: https://developers.google.com/maps/documentation/javascript/places#place_search_requests
         * @return {object} List of nearby amenities
         */
        function searchNearby(point, radius, options) {
            // Wrap google's callback-style API in a promise.
            var result = $q.defer();
            leafletData.getMap().then(function (map) {
                var googlemap = getGoogleMapObject(map);
                // Initializing a new PlacesService for every request seems ok
                var googlePlaceService = new google.maps.places.PlacesService(googlemap);
                var googPoint = new google.maps.LatLng(point[0], point[1]);
                var request = {
                    location: googPoint,
                    radius: radius,
                    rankBy: google.maps.places.RankBy.Distance
                };
                angular.extend(request, options);
                var nearbyPromiseWrapper = function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        result.resolve(results);
                    } else {
                        result.reject({ results: results, status: status});
                    }
                };
                googlePlaceService.nearbySearch(request, nearbyPromiseWrapper);
            });
            return result.promise;
        }

        /**
         * Get google map object from internal google map leaflet layer
         *
         *  NOTE: Relies on a private variable of the leaflet plugins google tile layer plugin
         *          This could break in the future.
         *
         * @param  {L.map} map
         * @return {google.maps.Map}
         */
        function getGoogleMapObject(map) {
            var googlemap = null;
            map.eachLayer(function (layer) {
                if (leafletHelpers.GoogleLayerPlugin.is(layer)) {
                    googlemap = layer._google;
                }
            });
            return googlemap;
        }
    }

    angular.module('nih.amenities')
    .factory('AmenitiesSearch', AmenitiesSearch);

})();
