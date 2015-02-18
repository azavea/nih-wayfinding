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
            var lastModified = 0;
            var issueCount = 0;
            if (feature && feature.properties) {
                lastModified = feature.properties.lastModified;
                issueCount = feature.properties.directions ? feature.properties.directions.warnings.length : 0;
            }
            var color = MapStyle.getLineColor(lastModified, issueCount);
            return {
                color: color,
                weight: 4,
                opacity: 1,
                clickable: false
            };
        }

        function mapRoute(origin, destination, steps) {
            var deferred = $q.defer();

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
                    text: msg
                });
                deferred.reject(msg);
            }

            Directions.get(origin, destination, steps).then(setGeojson, failure);
            return deferred.promise;
        }
    }
    angular.module('nih.mapping')
      .factory('MapRoute', MapRoute);

})();
