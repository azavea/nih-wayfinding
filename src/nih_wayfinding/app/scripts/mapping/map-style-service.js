
(function () {
    'use strict';

    /* ngInject */
    function MapStyle () {

        var module = {
            getLegendRamp: getLegendRamp,
            getLineColor: getLineColor,
            getBoundsStyle: getBoundsStyle
        };

        return module;

        function getLegendRamp() {
            return [
                '#3475A0',
                '#E0AD0A',
                '#000000'
            ];
        }

        function getBoundsStyle() {
            return {
                color: 'grey',
                weight: 4,
                opacity: 0.8,
                fill: false
            };
        }

        /**
         * Calculates the line color to use based on the age of the timestamp
         * Uses the legend ramp as the color palette
         *
         * @param epochSeconds {int} The epoch to get a color for, in seconds
         * @returns {string} hex color
         */
        function getLineColor(epochSeconds) {
            epochSeconds = parseInt(epochSeconds, 10);
            var ramp = module.getLegendRamp();
            var rampLength = ramp.length;
            if (isNaN(epochSeconds)) {
                return ramp[rampLength - 1];
            }
            var nowEpochMillis = (new Date()).getTime();
            var timestampEpochMillis = epochSeconds * 1000;
            var binWidthMonths = 6;
            var monthInMilliSeconds = 1000 * 60 * 60 * 24 * 30;     // assume each month is 30 days, close enough
            var ageInMonths = (nowEpochMillis - timestampEpochMillis) / monthInMilliSeconds;
            var index = Math.floor(ageInMonths / binWidthMonths);
            index = index >= rampLength ? rampLength - 1 : index;
            return ramp[index];
        }
    }

    angular.module('nih.mapping')
    .factory('MapStyle', MapStyle);

})();
