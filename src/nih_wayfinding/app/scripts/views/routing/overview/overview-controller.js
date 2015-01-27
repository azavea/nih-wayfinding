(function () {
    'use strict';

/*
    TODO: Show notification when any of the promises in this controller are rejected
        Causes for rejection include:
            - User disallows geolocation when necessary
            - Error getting routing data
*/

    /* ngInject */
    function OverviewController($scope, $stateParams, $q, $geolocation, leafletData,
                                Config, Directions, Map, MapControl, MapStyle, NavbarConfig,
                                Notifications, ProfileService) {
        var ctl = this;
        var defaultNonZeroWalkTime = 30;
        var geolocationAlertDelay = 400;
        var directionsOptions = {
            walkTimeMins: 0,
            wheelchair: false
        };
        initialize();

        function getDirections(data) {
            var currentUser = ProfileService.getCurrentUser();
            var options = angular.extend({}, directionsOptions, {
                wheelchair: !!(currentUser.preferences.wheelchairRequired)
            });
            Directions.get(data.origin, data.destination, options).then(setGeojson, function (error) {
                var msg = error.msg ? error.msg : 'Unable to load route. Please try again later.';
                Notifications.show({
                    text: msg,
                    timeout: 3000
                });
            });
        }

        function initialize() {
            NavbarConfig.set({
                title: 'Preview Route',
                back: 'locations'
            });
            ctl.map = Map;
            angular.extend(ctl.map.center, Config.center);
            angular.extend(ctl.map.bounds, Config.bounds);
            ctl.stateParams = $stateParams;
            readStateParams().then(getDirections, function () {
                Notifications.show({
                    text: 'Please allow geolocation in your browser to retrieve walking routes.'
                });
            });

            $scope.$on('leafletDirectiveMap.geojsonClick', showPopup);
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
                Notifications.show({
                    text: 'Click \'Allow\' in your browser\'s location prompt to request your route.',
                    imageClass: 'glyphicon-info-sign',
                    delay: geolocationAlertDelay
                });
                $geolocation.getCurrentPosition({}).then(function (position) {
                    Notifications.hide();
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
                    dfd.resolve({
                        origin: origin,
                        destination: destination
                    });
                }, function (error) {
                    dfd.reject(error);
                });
            }
            return dfd.promise;
        }

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

        function setGeojson(geojson) {
            var bbox = turf.extent(geojson);
            if (!Directions.isAudited(geojson)) {
                Notifications.show({
                    text: 'This route contains unverified segments. Please exercise caution.'
                });
            }
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
                    style: routeStyle,
                    resetStyleOnMouseout: true
                }
            });
        }

        function showPopup(event, feature) {
            MapControl.showPopup(feature);
        }
    }

    angular.module('nih.views.routing')
    .controller('OverviewController', OverviewController);

})();
