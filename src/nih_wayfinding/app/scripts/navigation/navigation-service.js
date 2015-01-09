
(function () {
    'use strict';

    /* ngInject */
    function Navigation (
        $q, $interval, $rootScope,
        $geolocation,
        NavigationStub
    ) {

        var stepsLeft = [];
        var navInterval = 1000; // 1 second default interval
        var mockRun;
        var pollRun;
        var module = {
            walkTheLine: walkTheLine,
            pollLocation: pollLocation,
            setInterval: setInterval,
            stopIntervalTask: stopIntervalTask
        };

        return module;

        /**
         *  Change the interval for walking/checking geolocation
         *
         *  @param interval {number} The walk/read interval in milliseconds
         *  @return undefined
         */
        function setInterval(interval) {
            navInterval = interval;
        }

        /**
         *  Return the steps that remain for walking the line
         *
         * @return {array} The steps that have been generated
         *
         */
        function getSteps() {
            return stepsLeft;
        }

        /**
         * Stop the interval task (either checking GPS or iterating the walk of mocked data)
         */
        function stopIntervalTask() {
            if (angular.isDefined(mockRun)) {
                $interval.cancel(mockRun);
                mockRun = undefined;
            }
            if (angular.isDefined(pollRun)) {
                $interval.cancel(pollRun);
                pollRun = undefined;
            }
        }

        /**
         * Take the next step on the path as created by genSteps
         *
         * @param interval {number} Milliseconds of interval between steps
         * @return {undefined}
         */
        function walkTheLine() {
            var locations = NavigationStub;
            stepsLeft = _.map(locations.features, function(feature) {
                return feature.geometry.coordinates;
            });
            var runMock = function() {
                mockRun = $interval(
                    function() {
                        if (stepsLeft.length > 0) {
                            $rootScope.$broadcast('nih.navigation.locationUpdated', stepsLeft.shift());
                        } else {
                            stopIntervalTask();
                        }
                    },
                    navInterval);
            };
            runMock();
        }

        /**
         * Poll for location using ngGeolocation module
         *
         * @return {undefined} Array representation of point: [[lng, lat], [lng, lat]]
         */
        function pollLocation() {
            var runPoll = function() {
                pollRun = $interval(
                    function() { // TODO: use $geolocation.watchPosition instead of getCurrentPosition
                        $rootScope.$broadcast('nih.navigation.locationUpdated',
                                              $geolocation.getCurrentPosition({
                                                  enableHighAccuracy: true,
                                                  timeout: 6000,
                                                  maximumAge: 60000
                                              })
                        );
                    },
                    navInterval);
            };
            runPoll();
        }

    }

    angular.module('nih.navigation')
      .factory('Navigation', Navigation);

})();
