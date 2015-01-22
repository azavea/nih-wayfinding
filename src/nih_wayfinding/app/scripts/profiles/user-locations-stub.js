(function () {
    'use strict';

    var UserLocationsStub = [{
        text: 'Post Office',
        img: '/images/icons/icon-postoffice.svg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Home',
        img: '/images/icons/icon-house.svg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Park',
        img: '/images/icons/icon-park.svg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Jennifer\'s House',
        img: '/images/icons/icon-jennifer.jpg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Grocery',
        img: '/images/icons/icon-shopping.svg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Cafe',
        img: '/images/icons/icon-cafe.svg',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }];

    angular.module('nih.profiles')
    .constant('UserLocationsStub', UserLocationsStub);

})();
