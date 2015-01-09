(function () {
    'use strict';

    var UserLocationsStub = [{
        text: 'Post Office',
        img: 'glyphicon-envelope',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Home',
        img: 'glyphicon-home',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Park',
        img: 'glyphicon-tree-deciduous',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Jennifer\'s House',
        img: 'glyphicon-user',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Grocery',
        img: 'glyphicon-cutlery',
        feature: {
            geometry: {
                x: 10,
                y: 10
            }
        }
    }, {
        text: 'Cafe',
        img: 'glyphicon-cutlery',
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
