
(function () {
    'use strict';

    /* ngInject */
    function AmenitiesSearch ($q, leafletData, leafletHelpers) {

        var googlePlaceService = null;

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
            if (!googlePlaceService) {
                leafletData.getMap().then(function (map) {
                    // The variable be initialized by the time this promise resolves from another
                    // searchNearby call, so check to make sure it doesn't exist here too
                    if (!googlePlaceService) {
                        var googlemap = getGoogleMapObject(map);
                        googlePlaceService = new google.maps.places.PlacesService(googlemap);
                    }
                    makePlacesRequest(point, radius, options);
                });
            } else {
                makePlacesRequest(point, radius, options);
            }
            return result.promise;

            // local function that simply wraps the places setup + request, which we have to make
            // in two places due to the caching logic. It depends on having result in the parent
            // scope, so don't go moving it around
            function makePlacesRequest(point, radius, options) {
                var googPoint = new google.maps.LatLng(point[0], point[1]);
                var request = {
                    location: googPoint,
                    radius: radius,
                    rankBy: google.maps.places.RankBy.Distance
                };
                angular.extend(request, options);
                var nearbyPromiseWrapper = function(results, status) {
                    console.log(results);
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        result.resolve(results);
                    } else {
                        result.reject({ results: results, status: status});
                    }
                };
                googlePlaceService.nearbySearch(request, nearbyPromiseWrapper);
            }
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
