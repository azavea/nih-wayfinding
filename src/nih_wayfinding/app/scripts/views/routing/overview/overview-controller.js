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
                                Directions, Map, MapControl, MapStyle, NavbarConfig, Notifications) {
        var ctl = this;
        var defaultNonZeroWalkTime = 30;
        var directionsOptions = {
            walkTimeMins: 0
        };
        initialize();

        function getDirections(data) {
            Directions.get(data.origin, data.destination, directionsOptions).then(setGeojson, function (error) {
                console.error(error);
                Notifications.show({
                    error: 'Unable to load route. Please try again later.',
                    timeout: 3000
                });
            });
        }

        function initialize() {
            NavbarConfig.set({ title: 'Preview Route' });
            ctl.map = Map;
            ctl.stateParams = $stateParams;
            readStateParams().then(getDirections, function (error) {
                console.log(error);
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

            if (origin && destination) {
                dfd.resolve({
                    origin: origin,
                    destination: destination
                });
            } else {
                Notifications.show({
                    text: 'Click \'Allow\' in your browser\'s location prompt to request your route.',
                    imageClass: 'glyphicon-info-sign'
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
            angular.extend(ctl.map, {
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