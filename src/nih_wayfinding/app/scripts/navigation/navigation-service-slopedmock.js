/*
 * The code in this file is kept here in case we need to mock arbitrary routes. If the one-off
 *  solution currently being used is sufficient for dev purposes, deletion of this file is
 *  to be considered warranted.
 */
(function () {
    'use strict';

    /* ngInject */
    function Navigation (
        $q, $interval, $rootScope
    ) {

        var stepsLeft = [];
        var navInterval = 1000; // 1 second default interval
        var mockRun;
        var module = {
            walkTheLine: walkTheLine,
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
         * For a given line - [[lng, lat], [lng, lat]] - find some points on that line segment
         *
         * @nosideeffects
         * @param lineSeg {array} The line segment to work on: [[lng, lat], [lng, lat]]
         * @param denom {number} The denominator, used to determine how closely placed
         *                        the lines are in Real space
         * @return {array} The array of points on given line segment
         */
        function pointsOnLine(lineSeg, denom) {
            var firstBound = lineSeg[0];
            var secondBound = lineSeg[1];
            if (firstBound === secondBound) { return []; }
            var m = (firstBound[1] - secondBound[1])/(firstBound[0] - secondBound[0]);
            if (isNaN(m)) {
                return [];
            } else if (m === Infinity) {
                var stepLen = -((firstBound[1] - secondBound[1]) / 10);
                var steps = _.map(_.range(1,11), function(num) {
                    return [firstBound[0], firstBound[1] + num * stepLen];
                });
                console.log(firstBound, steps, secondBound);
                return steps;
            }

            // Function for determining if we've gone too far
            var isPastSecondBound = function(point) {
                var lng = point[0];
                var lat = point[1];
                if (m > 0) {
                    if (lng > secondBound[0] || lat > secondBound[1]) {
                        return true;
                    }
                } else if (m < 0) {
                    if (lng <= secondBound[0] || lat <= secondBound[1]) {
                        return true;
                    }
                } else if (m === 0) {
                    if ((lng > secondBound[0] && firstBound[0] < secondBound[0]) ||
                        (lng < secondBound[0] && firstBound[0] > secondBound[0])) {
                        return true;
                    }
                }
                return false;
            };

            // Function to calculate a point given the index of the step with distance
            //  determined by the value of denom
            var calcPoint = function(distanceIndex) {
                return [firstBound[0] + (distanceIndex / denom),
                        firstBound[1] + ((distanceIndex * m) / denom)];
            };
            var points = [];
            // Iterate through unti past second bound, concatenating to array 'points'
            for (var i = 0; !isPastSecondBound(calcPoint(i)); i++) {
                var calculatedPoint = calcPoint(i);
                points.push(calcPoint(i));
            }
            points.push(secondBound);
            return points;
        }


        /**
         * Generate a list of steps to be taken from a list of line segments which
         *  constitute a path (or don't, but then things will look rather strange)
         *
         * @param lines {array} An array of line segments of the form: [[lng, lat], [lng, lat]]
         * @return {array} An array of steps on the provided path
         */
        function genSteps(lines) {
            var stepsLeft1 = lines.map(function(line) { return pointsOnLine(line, 15000); });
            var stepsLeft2 = _.flatten(stepsLeft1, true);
            stepsLeft = _.chain(lines)
              .map(function(line) {
                  return pointsOnLine(line, 15000);
              })
              .flatten(true)
              .value();
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
        }

        /**
         * Take the next step on the path as created by genSteps
         *
         * @param interval {number} Milliseconds of interval between steps
         * @return {array} Array representation of point: [[lng, lat], [lng, lat]]
         */
        function walkTheLine(geojson) {
            function deferredStepGen() {
                var deferred = $q.defer();
                var orderedPath = _.chain(geojson.features)
                  .filter(function(feature){ return feature.geometry.type === 'LineString'; })
                  .map(function(feature) { return feature.geometry.coordinates; })
                  .map(function(coords, i, fullArray) {
                      if (i > 0) {
                          var lastCoords = fullArray[i-1];
                          if (Math.sqrt(
                                  Math.pow(_.last(lastCoords)[0] + _.first(coords[0]), 2) +
                                  Math.pow(_.last(lastCoords)[1] + _.first(coords[1]), 2)
                              ) > Math.sqrt(
                                  Math.pow(_.last(lastCoords)[0] + _.last(coords[0]), 2) +
                                  Math.pow(_.last(lastCoords)[1] + _.last(coords[1]), 2)
                              )
                          ) {
                              return fullArray;
                          } else {
                              return fullArray.reverse();
                          }
                      } else {
                          return fullArray;
                      }
                  })
                  .flatten(true)
                  .flatten(true)
                  .value();
                var lineSegments = [];
                _.each(orderedPath, function(segment, i) {
                    if (i > 0) {
                        lineSegments.push([orderedPath[i-1], orderedPath[i]]);
                    }
                });
                deferred.resolve(genSteps(lineSegments));
                return deferred.promise;
            }
            deferredStepGen()
              .then(function() {
                var mockRun;
                var runMock = function() {
                    mockRun = $interval(
                        function() {
                            if (stepsLeft.length > 0) {
                                $rootScope.$broadcast('scanLoc', stepsLeft.shift());
                            } else {
                                stopIntervalTask();
                            }
                        },
                        200);
                };
                runMock();
            });
        }

        }

    angular.module('nih.navigation')
      .factory('Navigation', Navigation);

})();
