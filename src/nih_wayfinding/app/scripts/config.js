(function () {
    'use strict';

    var osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/"">CC-BY-SA</a>';

    var config = {
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
        // walker/cane speeds median from this study:
        // http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2941391/
        // chart: http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2941391/figure/F1/
        // wheelchair speeds from here:
        // http://www.hindawi.com/journals/rerp/2012/753165/tab1/
        assistanceSpeeds: {
            motorized: 1.56464, // ~3.5 mph
            manual: 0.6,
            walker: 0.2,
            cane: 0.4,
        },
        stubs: {
            geolocation: {
                latitude: 41.728496,
                longitude: -87.545001
            }
        },
        warningMinimumGrade: 5,
        locationTypes: [
            { img: '/images/icons/icon-cafe.svg', text: 'Cafe' },
            { img: '/images/icons/icon-house.svg', text: 'House' },
            { img: '/images/icons/icon-park.svg', text: 'Park' },
            { img: '/images/icons/icon-shopping.svg', text: 'Shopping' },
            { img: '/images/icons/icon-bank.svg', text: 'Bank' },
            { img: '/images/icons/icon-grocery.svg', text: 'Grocery' },
            { img: '/images/icons/icon-pharmacy.svg', text: 'Pharmacy' },
            { img: '/images/icons/icon-school.svg', text: 'School' },
            { img: '/images/icons/icon-house.svg', text: 'Other' },
        ]
    };

    angular.module('nih.config', [])
    .constant('Config', config);
})();
