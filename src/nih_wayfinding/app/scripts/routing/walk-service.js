(function () {
    'use strict';

    /* ngInject */
    function Walk(NicePlaces) {
        var defaults = {
            maxDistanceMeters: 5000,
            sampleSize: 2
        };
        var module ={
            getStops: getStops
        };

        return module;

        function getStops(point, maxDistance, sampleSize) {
            maxDistance = maxDistance || defaults.maxDistanceMeters;
            maxDistance /= 1000; // meters to km
            sampleSize = sampleSize || defaults.sampleSize;
            var nicePoints = NicePlaces.features.slice();
            angular.forEach(nicePoints, function (nicePoint) {
                nicePoint.properties.distance = turf.distance(point, turf.point(nicePoint.geometry.coordinates));
            });
            nicePoints = _(nicePoints).filter(function (nicePoint) {
                return nicePoint.properties.distance < maxDistance;
            }).sample(sampleSize).value();
            nicePoints.sort(clockwiseSort);

            console.log(nicePoints);
            return nicePoints;
        }

        function distanceSort(a, b) {
            return a.properties.distance - b.properties.distance;
        }

        function clockwiseSort(a, b) {
            return a.geometry.coordinates[0] - b.geometry.coordinates[0];
        }
    }


    angular.module('nih.routing')
    .factory('Walk', Walk);
})();
