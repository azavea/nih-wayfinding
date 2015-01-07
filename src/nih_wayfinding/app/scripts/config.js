
(function () {
    'use strict';

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
        center: {
            lat: 41.8749,
            lng: -87.6189,
            zoom: 14
        }
    };

    angular.module('nih.config', [])
    .constant('Config', config);

})();
