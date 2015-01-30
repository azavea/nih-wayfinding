(function () {
    'use strict';

    /* ngInject */
    function ProfilePreferenceOptions() {
        return {
            assistanceOpts: [{
                text: 'Yes',
                value: true
            }, {
                text: 'No',
                value: false
            }],

            assistanceTypeOpts: [{
                text: 'Manual wheelchair',
                value: 'manual'
            }, {
                text: 'Motorized wheelchair',
                value: 'motorized'
            }, {
                text: 'Walker',
                value: 'walker'
            }, {
                text: 'Cane',
                value: 'cane'
            }],

            steepTerrainOpts: [{
                text: 'Not very',
                value: 0.1
            }, {
                text: 'Somewhat',
                value: 0.5
            }, {
                text: 'Very',
                value: 1
            }],

            speedOpts: [{
                text: 'About average (2.5 mph)',
                value: 2.5
            }, {
                text: 'Slower than average (1.5 mph)',
                value: 1.5
            }, {
                text: 'Much slower than average (1 mph)',
                value: 1
            }],

            busyOpts: [{
                text: 'Yes',
                value: 1
            }, {
                text: 'No',
                value: -1
            }, {
                text: 'Not important',
                value: 0
            }],

            restOpts: [{
                text: 'Important',
                value: 1
            }, {
                text: 'Not important',
                value: 0
            }],

            newLocOpts: [{
                text: 'Create locations',
                value: true
            }, {
                text: 'No thanks',
                value: false
            }]
        };

    }

    angular.module('nih.profiles')
      .factory('ProfilePreferenceOptions', ProfilePreferenceOptions);

})();
