(function () {
    'use strict';

    /* ngInject */
    function DistanceFilter() {
        /**
         * Return human readable distance with units
         * @param  {Number} input distance traveled in meters
         * @return {String} Distance readable with units, e.g. 500ft or 1.2miles
         */
        return function (input) {
            var inputMeters = parseInt(input, 10);
            var oneThousandFeetInMeters = 305;
            var ftPerMeter = 3.281;
            var miPerMeter = 0.000621371192;
            if (isNaN(inputMeters)) {
                return '';
            }
            if (inputMeters < oneThousandFeetInMeters) {
                return Math.floor(inputMeters * ftPerMeter) + ' ft';
            } else {
                return (inputMeters * miPerMeter).toFixed(1) + ' mi';
            }
        };
    }

    angular.module('nih.routing')
    .filter('distance', DistanceFilter);
})();
