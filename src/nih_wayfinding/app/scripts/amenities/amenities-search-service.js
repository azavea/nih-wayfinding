
(function () {
    'use strict';

    /* ngInject */
    function AmenitiesSearch ($q) {

        // TODO: This is a hack; PlacesService throws really weird errors if you don't pass
        // it a <div> or a Map object, but since Google Maps is wrapped in Leaflet which is
        // in turn wrapped in angular-leaflet, doing this correctly would add significant
        // complexity to this service.
        var mapDiv = $('div.angular-leaflet-map > div.leaflet-google-layer')[0];
        // Private variables
        var googlePlaceService = new google.maps.places.PlacesService(mapDiv);

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
            var googPoint = new google.maps.LatLng(point[0], point[1]);
            var request = {
                location: googPoint,
                radius: radius,
            };
            angular.extend(request, options);
            // Wrap google's callback-style API in a promise.
            var result = $q.defer();
            var nearbyPromiseWrapper = function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    result.resolve(results);
                } else {
                    result.reject({ results: results, status: status});
                }
            };
            googlePlaceService.nearbySearch(request, nearbyPromiseWrapper);
            return result.promise;
        }
    }

    angular.module('nih.amenities')
    .factory('AmenitiesSearch', AmenitiesSearch);

})();
