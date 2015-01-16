(function () {
    'use strict';

    /* ngInject */
    function ProfilePreferenceOptions() {
        return {
            wheelchairUseOpts: [{
                text: 'Yes',
                value: true
            }, {
                text: 'No',
                value: false
            }],

            wheelchairTypeOpts: [{
                text: 'Electric',
                value: true
            }, {
                text: 'Manual',
                value: false
            }],

            challengeOpts: [{
                text: 'Minimal',
                value: 0.1
            }, {
                text: 'Moderate',
                value: 0.5
            }, {
                text: 'Challenge me',
                value: 1
            }],

            steepTerrainOpts: [{
                text: 'Not comfortable',
                value: 0.1
            }, {
                text: 'Somewhat comfortable',
                value: 0.5
            }, {
                text: 'Totally comfortable',
                value: 1
            }],

            speedOpts: [{
                text: 'Slower than average',
                value: 0.1
            }, {
                text: 'About Average',
                value: 0.5
            }, {
                text: 'Faster than average',
                value: 1
            }],

            peaceOpts: [{
                text: 'Not important',
                value: 0.1
            }, {
                text: 'Somewhat important',
                value: 0.5
            }, {
                text: 'Very Important',
                value: 1
            }],

            restOpts: [{
                text: 'Not regularly',
                value: 0.1
            }, {
                text: 'Somewhat regularly',
                value: 0.5
            }, {
                text: 'Very regularly',
                value: 1
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
