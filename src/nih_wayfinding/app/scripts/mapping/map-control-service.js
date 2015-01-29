(function () {
    'use strict';

    function MapControl ($http, $q, Config, leafletData) {
        var popup = null;
        var boundsUrl = Config.routing.hostname + '/otp/routers/default';

        var module = {
            cleanLonLatParam: cleanLonLatParam,
            getGraphBounds: getGraphBounds,
            pointToLngLat: pointToLngLat,
            showPopup: showPopup,
            trackUser: trackUser,
            markLocation: markLocation
        };

        return module;

        /**
         * Cleans string of form 'lon,lat' to an array of form [lon, lat]
         *
         * @param lonLat {string} String value to clean
         * @returns {array} [lon, lat] or null if string could not be parsed
         */
        function cleanLonLatParam(lonLat) {
            if (!(lonLat && lonLat.split)) {
                return null;
            }
            lonLat = lonLat.split(',');
            var lon = parseFloat(lonLat[0]);
            var lat = parseFloat(lonLat[1]);
            if (isNaN(lon) || isNaN(lat)) {
                return null;
            } else {
                return [lon, lat];
            }
        }

        /**
         * Get the graph bounds from the OTP server
         *
         * @returns {geojson} Graph bounds polygon
         */
        function getGraphBounds() {
            var dfd = $q.defer();
            $http.get(boundsUrl, {
                cache: true
            }).then(function (response) {
                var boundsPolygon = response.data.polygon;
                if (boundsPolygon) {
                    dfd.resolve(boundsPolygon);
                } else {
                    dfd.reject(response.data.error);
                }
            });

            return dfd.promise;
        }

        function pointToLngLat(pointFeature) {
            return pointFeature.geometry.coordinates;
        }

        /**
         * Shows popup with text of a single feature property, denoted by key
         *  TODO: Make more robust if this function makes it out of the prototype
         *
         * @param feature {object} geojson feature to display
         * @param key {string} key for the properties object to show in popup
         * @return undefined Shows popup or does nothing if feature not a Point
         */
        function showPopup(feature, key) {
            key = key || 'type';
            if (feature.geometry.type !== 'Point') {
                return;
            }
            leafletData.getMap().then(function(map) {
                if (popup) {
                    map.closePopup();
                    popup = null;
                }
                popup = L.popup()
                .setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
                .setContent(feature.properties[key])
                .openOn(map);
            });
        }

        /**
         * For a given point, attach a location marker on that point
         *
         * @param point {array} [Lng, Lat] array of coordinates
         * @return undefined Shows marker
         *
         */
        function markLocation(point) {
            leafletData.getMap().then(function(map) {
                var lnglat = [point[1], point[0]];
                var locationMarker = new L.Marker(lnglat);
                map.addLayer(locationMarker);
            });
        }

        var userMarker = null;
        /**
         * For a given point attach a user marker on that point
         *
         * @param point {array} [Lng, Lat] array of coordinates
         * @return undefined Shows (or moves) a marker
         */
        function trackUser(point) {
            leafletData.getMap().then(function(map) {
                var lnglat = [point[1], point[0]];
                if (userMarker) {
                  userMarker.setLatLng(lnglat);
                } else {
                  userMarker = new L.CircleMarker(lnglat);
                  map.addLayer(userMarker);
                }
            });
        }
    }

    angular.module('nih.mapping')
    .factory('MapControl', MapControl);

})();
