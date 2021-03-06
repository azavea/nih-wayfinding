
(function () {
    'use strict';

    /* ngInject */
    function MapStyle () {

        var module = {
            getLegendRamp: getLegendRamp,
            getLineColor: getLineColor,
            getBoundsStyle: getBoundsStyle,
            getRouteLineStyle: getRouteLineStyle
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
         * @param issueCount {int} The number of issues identified along the edge
         * @returns {string} hex color
         */
        function getLineColor(epochSeconds, issueCount) {
            epochSeconds = parseInt(epochSeconds, 10);
            var ramp = module.getLegendRamp();
            var rampLength = ramp.length;
            if (isNaN(epochSeconds) || epochSeconds === 0) {
                return ramp[rampLength - 1];
            }

            if (issueCount > 0) {
                return ramp[1];
            }

            return ramp[0]; // audited edge with no issues

            /* TODO: uncomment this section for use when we have have true audit dates?
            var nowEpochMillis = (new Date()).getTime();
            var timestampEpochMillis = epochSeconds * 1000;
            var binWidthMonths = 6;
            var monthInMilliSeconds = 1000 * 60 * 60 * 24 * 30;     // assume each month is 30 days, close enough
            var ageInMonths = (nowEpochMillis - timestampEpochMillis) / monthInMilliSeconds;
            var index = Math.floor(ageInMonths / binWidthMonths);
            index = index >= rampLength ? rampLength - 1 : index;
            return ramp[index];
            */
        }

        function getRouteLineStyle(feature) {
            if (feature.geometry.type !== 'LineString') {
                return;
            }
            var lastModified = 0;
            var issueCount = 0;
            if (feature && feature.properties) {
                lastModified = feature.properties.lastModified;
                issueCount = feature.properties.directions ? feature.properties.directions.warnings.length : 0;
            }
            var color = getLineColor(lastModified, issueCount);
            return {
                color: color,
                weight: 4,
                opacity: 1,
                clickable: false
            };
        }
    }

    angular.module('nih.mapping')
    .factory('MapStyle', MapStyle);

})();
