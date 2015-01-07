(function () {
    'use strict';

    var osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    var config = {
        bounds: {
            southWest: {
                lat: 41.643919,
                lng: -87.940101,
            },
            northEast: {
                lat: 42.023022,
                lng: -87.523984
            }
        },
        baseLayers: {
            stamentonerlite: {
                name: 'Stamen Toner Lite',
                type: 'xyz',
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
                layerOptions: {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> ' +
                        '&mdash; ' + osmAttribution,
                    subdomains: ['a', 'b', 'c', 'd'],
                    minZoom: 3,
                    maxZoom: 20,
                    continuousWorld: true
                }
            }
        },
        center: {
            lat: 41.8749,
            lng: -87.6189,
            zoom: 15
        }
    };

    angular.module('nih.config', [])
    .constant('Config', config);

})();
