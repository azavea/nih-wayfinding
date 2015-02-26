(function () {
    'use strict';

/*
    TODO: Show notification when any of the promises in this controller are rejected
        Causes for rejection include:
            - User disallows geolocation when necessary
            - Error getting routing data
*/

    /* ngInject */
    function OverviewController($scope, $stateParams, $q, leafletData,
                                Config, Directions, Map, MapControl, MapStyle, NavbarConfig,
                                Navigation, Notifications, ProfileService, RouteCache, Walk) {
        var ctl = this;
        var boundsLayer = null;
        var currentUser = null;
        var directionsOptions = {};
        initialize();

        function initialize() {
            NavbarConfig.set({
                title: 'Preview Route',
                back: 'locations',
                color: NavbarConfig.colors.routing
            });
            ctl.map = Map;
            ctl.summary = {
                timeMinutes: 0,
                distanceMeters: 0,
                turns: 0
            };
            currentUser = ProfileService.getCurrentUser();
            angular.extend(ctl.map.center, Config.center);
            angular.extend(ctl.map.bounds, Config.bounds);
            setGraphBounds();
            ctl.stateParams = $stateParams;
            readStateParams().then(getDirections);

            $scope.$on('leafletDirectiveMap.geojsonClick', showPopup);
        }

        function getDirections(data) {
            var steps = null;
            if (directionsOptions.walkTimeMins > 0) {
                var walkKm = currentUser.getWalkDistance(directionsOptions.walkTimeMins);
                steps = Walk.getStops(turf.point(data.origin), walkKm);
            }

            Navigation.setDestination(data.destination);
            if (!!($stateParams.back) && RouteCache.hasData()) {
                setGeojson(RouteCache.getCache());
            } else {
                Directions.get(data.origin, data.destination, steps).then(setGeojson, function (error) {
                    var msg = error.msg ? error.msg : 'Unable to load route. Please try again later.';
                    Notifications.show({
                        text: msg
                    });
                });
            }
        }

        /**
         * Read origin and destination params to make routing request
         * If origin and dest: use both
         * Otherwise: use currentlocation to fill the blanks
         */
        function readStateParams() {
            var dfd = $q.defer();
            var destination = MapControl.cleanLonLatParam($stateParams.destination);
            var origin = MapControl.cleanLonLatParam($stateParams.origin);
            directionsOptions.walkTimeMins = parseInt($stateParams.walkTimeMins, 10) || 0;

            if (origin && destination) {
                dfd.resolve({
                    origin: origin,
                    destination: destination
                });
            } else {
                Navigation.getCurrentPosition({}).then(function (position) {
                    var currentPosition = [position.coords.longitude, position.coords.latitude];
                    if (!destination) {
                        destination = currentPosition;
                    }
                    if (!origin) {
                        origin = currentPosition;
                    }
                    MapControl.trackUser(currentPosition);
                    dfd.resolve({
                        origin: origin,
                        destination: destination
                    });
                });
            }
            return dfd.promise;
        }

        /**
         * Draws the graph bounds outline on the map.
         *
         * Accesses the Leaflet map directly, bypassing the Leaflet directive,
         * so the bounds layer may be shown at the same time as another GeoJSON layer.
         * (Leaflet directive only supports a single GeoJSON layer at a time.)
         */
        function setGraphBounds() {
            MapControl.getGraphBounds().then(function(geojson) {
                leafletData.getMap().then(function(map) {
                    if ((boundsLayer !== null) && map.hasLayer(boundsLayer)) {
                        map.removeLayer(boundsLayer);
                    }
                    boundsLayer = new L.GeoJSON(geojson, {
                        style: MapStyle.getBoundsStyle(),
                        resetStyleOnMouseout: true
                    });
                    boundsLayer.addTo(map);
                    boundsLayer.bringToBack();
                });
            }, function (error) {
                console.error('Could not get graph bounds from OTP');
                console.error(error);
            });
        }

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
            angular.extend(ctl.map, {
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
                    style: MapStyle.getRouteLineStyle,
                    resetStyleOnMouseout: true
                },
                markers: {
                    end: {
                        lat: lastPoint[1],
                        lng: lastPoint[0]
                    }
                }
            });
            var summary = Directions.getRouteSummary(geojson, currentUser.preferences.speed);
            ctl.summary = angular.extend(ctl.summary, summary);
            RouteCache.setCache(geojson);
        }

        function showPopup(event, feature) {
            MapControl.showPopup(feature);
        }
    }

    angular.module('nih.views.routing')
     .controller('OverviewController', OverviewController);

})();
