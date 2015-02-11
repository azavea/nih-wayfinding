/**
 *
 * This navigation controller does nothing, now that the Directions.get endpoint returns an
 * actual response. Rather than restub it out now, we can just properly build out the remainder
 * of the interactions on this view all at once.
 *
 * TODO:
 *   - Init map at current location navigating to destination param via Directions.get()
 *     - This task should also save the geojson being used so that it might be called back up
 *        after playing with other dialogs.
 *   - Add direction text, e.g. Turn left in x ft at 1000 Market St
 *   - When we approach each step, speak audible alert and then switch the current direction text
 *   - Offer to reroute user if they leave the current path
 */
(function () {
    'use strict';

    /* ngInject */
    function NavigateController(
        $filter, $scope, $stateParams, $state,
        leafletData,
        Navigation, Directions, Map, MapControl, MapRoute, NavbarConfig,
        Rerouting, Notifications, ProfileService
    ) {
        var ctl = this;
        var mphToMs = 0.44704;
        var kmToM = 1000;
        initialize();

        function initialize() {
            setDefaultFooter();
            NavbarConfig.set({
                title: 'Navigate Route',
                color: NavbarConfig.colors.navigation,
                back: 'routing'
            });
            ctl.map = Map;
            ctl.nextStep = Navigation.stepNext;
            ctl.offCourse = Navigation.offCourse;

            if ($stateParams.reroute) {
                handleReroute($stateParams.reroute);
            }

            // Subscribe to the location update event
            $scope.$on('nih.navigation.positionOffCourse', onPositionOffCourse);
            $scope.$on('nih.navigation.positionUpdated', onPositionUpdated);

            var geojson = ctl.map.geojson.data;
            Navigation.setRoute(geojson);
            Navigation.stepFirst();
        }

        /**
         * The footer dialog on this page requires alternative state so that rerouting can be
         *  incorporated directly onto the map page rather than in another dialog. This function
         *  provides the default state
         */
        function setDefaultFooter() {
            ctl.footer = {
                left:  {
                    text: 'Reroute',
                    onClick: function() { $state.go('reroute'); }
                },
                right: {
                    text: 'Report',
                    onClick: function() { $state.go('report'); }
                }
            };
        }

        /**
         * The footer dialog on this page requires alternative state so that rerouting can be
         *  incorporated directly onto the map page rather than in another dialog. This function
         *  provides the rerouting state
         */
        function setRerouteFooter() {
            ctl.footer = {
                left:  {
                    text: 'Cancel',
                    onClick: clearReroute
                },
                right: {
                    text: 'Route',
                    onClick: planReroute
                }
            };
        }

        /**
         * Generate a route and display it on the map for a given user position and targetted destination
         */
        function planReroute() {
            var currentPosition;
            Navigation.getCurrentPosition().then(function(position) {
                currentPosition = [position.coords.longitude, position.coords.latitude];
                MapControl.trackUser(currentPosition);
                Directions.get(currentPosition,
                               [ctl.destination.lng, ctl.destination.lat]).then(success, failure);
            });
            function success(response) {
                clearReroute();
                MapControl.plotGeoJSON(response);

                MapRoute.mapRoute(currentPosition,
                                  [ctl.destination.lng, ctl.destination.lat]).then(function(mappedRoute) {
                    angular.extend(ctl.map, mappedRoute);
                    Navigation.setRoute(ctl.map.geojson.data);
                    Navigation.stepFirst();
                });

            }
            function failure() {
                clearReroute();
            }
        }

        /**
         * Delete all markers from reroute dialog
         */
        function clearReroute() {
            MapControl.purgeMarkers(ctl.markedLocations);
            setDefaultFooter();
        }

        /**
         * Click handler for reroute dialog markers
         */
        function registerMarker(event) {
            _(ctl.markedLocations)
                .forEach(function(markedLocation) {
                    markedLocation.setIcon(new L.Icon.Default());
                });
            // Change the look of icon
            var newIcon = L.AwesomeMarkers.icon({icon: 'coffee', markerColor: 'green'});
            event.target.setIcon(newIcon);

            // Register this icon as selected on $scope
            var latlng = event.latlng;
            ctl.destination = latlng;
        }

        /**
         * Called whenever this controller is instantiated - if a `reroute` query parameter is specified,
         *  find nearby amenities which match that query parameter and display them on the map. If any
         *  are displayed on the map, change the bottom dialog to 'Cancel' and 'Route' buttons, which
         *  control whether and when the route is changed to some nearby amenity.
         *
         * @param rerouteType {string} The query parameter string fed to `?reroute=`
         */
        function handleReroute(rerouteType) {
            ctl.markedLocations = [];
            setRerouteFooter();
            Rerouting.reroute(rerouteType).then(success, failure);
            function success(amenities) {
                leafletData.getMap().then(function(map) {
                  map.setZoom(13);
                });
                Notifications.show({
                    text: 'Select the destination you\'d like to be routed to'
                });
                _(amenities)
                  .take(5)
                  .forEach(function(amenity) {
                      var geo = amenity.geometry.location;
                      MapControl.markLocation([geo.B, geo.k], {clickHandler: registerMarker})
                        .then(function(marker) {
                            ctl.markedLocations = ctl.markedLocations.concat(marker);
                        });
                  });
            }
            function failure() {
                setDefaultFooter();
                Notifications.show({
                    text: 'Failed to find nearby amenities',
                    timeout: 3000
                });
            }
        }

        /**
         * Utility method for event handlers to move a user along the given route
         *
         * @param point {object} A point object which represents the new user position
         */
        function updateUserPosition(point) {
            MapControl.trackUser(point.geometry.coordinates);
            angular.extend(ctl.map.center, {
                lat: point.geometry.coordinates[1],
                lng: point.geometry.coordinates[0],
                zoom: 19
            });
        }

        /**
         * Event handler to be called when the user walks off course, reroutes via Directions.get
         *     and resets geojson/route
         *
         * @param event {object} The event being fired
         * @param position {geojson Point} The point which the user now occupies
         */
        function onPositionOffCourse(event, position) {
            NavbarConfig.set({
                title: 'Re-routing...',
                leftImage: 'glyphicon-warning-sign'
            });
            updateUserPosition(position);

            var origin = position.geometry.coordinates;
            var destination = _(ctl.map.geojson.data.features)
                .map(function (feature) { return feature.geometry.coordinates; })
                .flatten(true)
                .last();
            Directions.get(origin, destination).then(function (geojson) {
                ctl.map.geojson = angular.extend(ctl.map.geojson, {
                    data: geojson
                });
                Navigation.setRoute(geojson);
                Navigation.stepFirst();
            }, function () {
                // TODO: Improve the wording here, using "reroute" in subtitle is confusing
                NavbarConfig.set({
                    title: 'You are off course and we were unable to reroute you.',
                    subtitle: 'Tap "Reroute" to choose a new destination.',
                    leftImage: 'glyphicon-warning-sign'
                });
            });
        }

        /**
         * Event handler to be called when the user's position is updated
         *
         * @param event {object} The event being fired
         * @param position {object} The point which the user now occupies
         */
        function onPositionUpdated(event, position) {
            var point = position.point;
            updateUserPosition(point);

            // Find distance to next turn, and display directions text/time/distance in navbar
            var distanceToTurn = turf.distance(point, position.destination, 'kilometers') * kmToM;
            var text = position.properties.directions.text;
            var turnIcon = Directions.getTurnIconName(position.properties.directions.turn);
            var speedMs = (ProfileService.getCurrentUser().preferences.speed || 1) * mphToMs;
            var timeMins = (distanceToTurn / speedMs / 60).toFixed(0);
            var distanceText = 'In approx. ' +  timeMins +
                ' min (' + $filter('distance')(distanceToTurn) + ').';
            var subtitleText = distanceText;
            var rightImages = [];
            _.each(position.properties.directions.warnings, function(warning) {
                rightImages.push(warning);
            });
            _.each(position.properties.directions.features, function(feature) {
                rightImages.push(feature);
            });
            NavbarConfig.set({
                title: text,
                subtitle: subtitleText,
                color: NavbarConfig.colors.navigation,
                leftImage: turnIcon,
                rightImages: rightImages
            });
        }
    }

    angular.module('nih.views.navigate')
      .controller('NavigateController', NavigateController);

})();
