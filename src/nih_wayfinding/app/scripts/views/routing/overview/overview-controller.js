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
                                Config, Directions, Map, MapControl, MapStyle, MapRoute, NavbarConfig,
                                Navigation, Notifications, ProfileService) {
        var ctl = this;
        var boundsLayer = null;
        var currentUser = null;
        var defaultNonZeroWalkTime = 30;
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
            Navigation.setDestination(data.destination);
            MapRoute.mapRoute(data.origin, data.destination).then(function(mappedRoute) {
                angular.extend(ctl.map, mappedRoute);
                ctl.summary = angular.extend(ctl.summary, Directions.getRouteSummary());
            });
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
            directionsOptions.walkTimeMins = $stateParams.walkTimeMins || 0;

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
                    if (_.isEqual(origin, destination)) {
                        directionsOptions.walkTimeMins = defaultNonZeroWalkTime;
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

        function showPopup(event, feature) {
            MapControl.showPopup(feature);
        }
    }

    angular.module('nih.views.routing')
     .controller('OverviewController', OverviewController);

})();
