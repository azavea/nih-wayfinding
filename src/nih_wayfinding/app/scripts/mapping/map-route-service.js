/**
 *
 */
(function() {
    'use strict';

    /* ngInject */
    function MapRoute($q,
                      Config, Directions, MapStyle, Notifications, ProfileService) {

        var module = {
            mapRoute: mapRoute
        };
        return module;

        function routeStyle(feature) {
            if (feature.geometry.type !== 'LineString') {
                return;
            }
            var lastModified = feature && feature.properties ? feature.properties.lastModified : 0;
            var color = MapStyle.getLineColor(lastModified);
            return {
                color: color,
                weight: 4,
                opacity: 1,
                clickable: false
            };
        }

        function mapRoute(origin, destination, opts) {
            var mphToMs = 0.44704;
            var directionsOptions = {
                walkTimeMins: 0,
                wheelchair: false
            };
            var currentUser = ProfileService.getCurrentUser();
            var deferred = $q.defer();
            var options = angular.extend(directionsOptions, opts, {
                wheelchair: !!(currentUser.preferences.wheelchairRequired),
                walkSpeed: currentUser.preferences.speed * mphToMs
            });

            // Success handler on promise
            function setGeojson(geojson) {
                if (!(geojson && geojson.features.length)) {
                    Notifications.show({
                        text: 'No valid route found. Please go back and try again.'
                    });
                    return;
                }
                var bbox = turf.extent(geojson);
                if (!Directions.isAudited(geojson)) {
                    Notifications.show({
                        text: 'This route contains unverified segments. Please exercise caution.'
                    });
                }
                var lastPoint = _(geojson.features)
                    .map(function (feature) { return feature.geometry.coordinates; })
                    .flatten(true)
                    .last();
                deferred.resolve({
                    bounds: {
                        southWest: {
                            lat: bbox[1],
                            lng: bbox[0]
                        },
                        northEast: {
                            lat: bbox[3],
                            lng: bbox[2]
                        }
                    },
                    geojson: {
                        data: geojson,
                        style: routeStyle,
                        resetStyleOnMouseout: true
                    },
                    markers: {
                        end: {
                            lat: lastPoint[1],
                            lng: lastPoint[0]
                        }
                    }
                });
            }

            // Failure handler on promise
            function failure(error) {
                var msg = error.msg ? error.msg : 'Unable to load route. Please try again later.';
                Notifications.show({
                    text: msg,
                    timeout: 3000
                });
                deferred.reject(msg);
            }

            Directions.get(origin, destination, options).then(setGeojson, failure);
            return deferred.promise;
        }
    }
    angular.module('nih.mapping')
      .factory('MapRoute', MapRoute);

})();
