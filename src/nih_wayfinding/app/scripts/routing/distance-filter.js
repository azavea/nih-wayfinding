(function () {
    'use strict';

    /* ngInject */
    function DistanceFilter() {
        var oneMileInMeters = 1609.344;
        var ftPerMeter = 3.281;
        var miPerMeter = 0.000621371192;

        /**
         * Return human readable distance with units
         * @param  {Number} input distance traveled in meters
         * @return {String} Distance readable with units, e.g. 500ft or 1.2miles
         */
        return function (input) {
            var inputMeters = parseInt(input, 10);
            var oneThousandFeetInMeters = 305;
            if (isNaN(inputMeters)) {
                return '';
            }
            if (inputMeters < oneThousandFeetInMeters) {
                return Math.floor(inputMeters * ftPerMeter) + ' ft';
            } else {
                return milesWithFraction(inputMeters);
            }
        };

        function milesWithFraction(meters) {
            var text = [];
            var miles = meters * miPerMeter;
            var fraction = null;
            if (miles >= 1) {
                text.push(miles.toFixed(1));
            } else {
                // Super cheap, but I don't think it makes sense to add another library or do full GCD
                // fractions here
                var firstPastDecimal = Math.floor((miles * 10) % 10);
                if (firstPastDecimal < 3) {
                    fraction = '1/4';
                } else if (firstPastDecimal < 4) {
                    fraction = '1/3';
                } else if (firstPastDecimal < 6) {
                    fraction = '1/2';
                } else if (firstPastDecimal < 7) {
                    fraction = '2/3';
                } else if (firstPastDecimal < 9) {
                    fraction = '3/4';
                } else {
                    fraction  = '1';
                }
                text.push(fraction);
            }
            text.push('mi');
            return text.join(' ');
        }
    }

    angular.module('nih.routing')
    .filter('distance', DistanceFilter);
})();
