(function () {
    'use strict';

    function MapControl (leafletData) {
        var popup = null;

        var module = {
            cleanLonLatParam: cleanLonLatParam,
            showPopup: showPopup,
            trackUser: trackUser
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

        var userMarker = null;
        /**
         * For a given point attach a marker on that point
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
