(function () {
    'use strict';

    var osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    var config = {
        defaultUserSettings: {
            username: 'User',
            locations: [],
            preferences: {
                assistanceRequired: false,
                assistanceType: null,
                busy: 0,
                restFrequency: 0,
                speed: 1.1176,
                surfaceTypeComfort: 0.5
            }
        },
        bounds: {
            southWest: {
                lat: 41.7056,
                lng: -87.5943,
            },
            northEast: {
                lat: 41.762,
                lng: -87.5201
            }
        },
        baseLayers: {
            googleStreets: {
                name: 'Google Streets',
                type: 'google',
                layerType: 'ROADMAP'
            },
            // TODO: This needs to be removed once we start displaying Google Places data, but
            // for development it's good to have as a comparison since the Leaflet plugin enabling
            // Google layers may not always work perfectly.
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
        center: {},
        nearbySearchRadius: 500,
        wheelchairSpeeds: {
            motorized: 1.56464, // ~3.5 mph
            manual: 0.6 // ~0.6 m/s (http://www.hindawi.com/journals/rerp/2012/753165/tab1/)
        },
        stubs: {
            geolocation: {
                latitude: 41.744431,
                longitude: -87.566115
            }
        },
        warningMinimumGrade: 5
    };

    angular.module('nih.config', [])
    .constant('Config', config);
})();
