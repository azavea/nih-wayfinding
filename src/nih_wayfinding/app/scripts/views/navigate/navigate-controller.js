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
        Navigation, Directions, Map, MapControl, NavbarConfig,
        Notifications, ProfileService
    ) {
        var ctl = this;
        var mphToMs = 0.44704;
        var kmToM = 1000;
        initialize();

        function initialize() {
            setDefaultFooter();
            setNavbar({
                title: 'Navigate Route',
                back: 'routing'
            });

            ctl.map = Map;
            ctl.nextStep = Navigation.stepNext;
            ctl.offCourse = Navigation.offCourse;

            // Subscribe to the location update event
            $scope.$on('nih.navigation.positionOffCourse', onPositionOffCourse);
            $scope.$on('nih.navigation.positionUpdated', onPositionUpdated);
            $scope.$on('nih.navbarconfig.rightbuttonclicked', onNavbarButtonClicked);

            var geojson = ctl.map.geojson.data;

            Navigation.setRoute(geojson);
            Navigation.stepCurrent();
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

        function setNavbar(options) {
            var isRerouting = Navigation.isRerouting();
            var color = isRerouting ? NavbarConfig.colors.reroute : NavbarConfig.colors.navigation;
            var back = isRerouting ? false : 'routing';
            var defaults = {
                color: color,
                rightButton: {
                    text: 'RESUME ROUTE',
                    dropdown: false
                },
                back: back
            };
            NavbarConfig.set(angular.extend({}, defaults, options));
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
                ' min (' + $filter('distance')(distanceToTurn) + ')';
            if (position.properties.turnamenity) {
                distanceText += ' at the ' + position.properties.turnamenity.name;
            }
            var subtitleText = distanceText;
            var rightImages = [];
            if (position.properties.directions.warnings && position.properties.directions.warnings.length > 0) {
                rightImages.push(position.properties.directions.warnings[0].img);
            }
            _.each(position.properties.directions.features, function(feature) {
                rightImages.push(feature.img);
            });
            setNavbar({
                title: text,
                subtitle: subtitleText,
                leftImage: turnIcon,
                rightImages: rightImages
            });
        }

        function onNavbarButtonClicked() {
            Navigation.getCurrentPosition().then(function (position) {
                var origin = [position.coords.longitude, position.coords.latitude];
                var destination = Navigation.getDestination();
                Directions.get(origin, destination).then(function (geojson) {
                    ctl.map.geojson = angular.extend(ctl.map.geojson, {
                        data: geojson
                    });
                    Navigation.setRoute(geojson);
                    Navigation.stepFirst();
                });
            });
        }
    }

    angular.module('nih.views.navigate')
      .controller('NavigateController', NavigateController);

})();
