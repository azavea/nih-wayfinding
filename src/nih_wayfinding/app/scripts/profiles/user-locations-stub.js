(function () {
    'use strict';

    var UserLocationsStub = [{
        text: 'Post Office',
        img: 'http://lorempixel.com/210/110',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Home',
        img: 'http://lorempixel.com/210/110',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Park',
        img: 'http://lorempixel.com/210/110',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Jennifer\'s House',
        img: 'http://lorempixel.com/210/110',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Grocery',
        img: 'http://lorempixel.com/210/110',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Cafe',
        img: 'http://lorempixel.com/210/110',
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
