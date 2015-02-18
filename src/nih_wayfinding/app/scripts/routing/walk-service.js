(function () {
    'use strict';

    /* ngInject */
    function Walk(NicePlaces) {
        var module ={
            getStops: getStops
        };

        return module;

        function getStops(point, tripLengthKm) {
            var tripParams = getTripParams(tripLengthKm);
            var nicePoints = NicePlaces.features.slice();
            angular.forEach(nicePoints, function (nicePoint) {
                nicePoint.properties.distance = turf.distance(point, turf.point(nicePoint.geometry.coordinates));
            });
            nicePoints = _(nicePoints).filter(function (nicePoint) {
                return nicePoint.properties.distance < tripParams.maxDistance;
            }).sample(tripParams.sampleSize).value();
            nicePoints.sort(clockwiseSort);
            return _.map(nicePoints, function (nicePoint) {
                return nicePoint.geometry.coordinates;
            });
        }

        function distanceSort(a, b) {
            return a.properties.distance - b.properties.distance;
        }

        function clockwiseSort(a, b) {
            return a.geometry.coordinates[0] - b.geometry.coordinates[0];
        }

        function getTripParams(tripLengthKm) {

            var sampleSize = tripLengthKm > 1.5 ? 4 : 3;
            var maxDistanceKm = tripLengthKm / sampleSize;
            return {
                maxDistance: maxDistanceKm,
                sampleSize: sampleSize
            };
        }
    }


    angular.module('nih.routing')
    .factory('Walk', Walk);
})();
