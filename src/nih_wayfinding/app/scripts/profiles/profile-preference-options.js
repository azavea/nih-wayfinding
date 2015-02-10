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

            surfaceTypeComfortOpts: [{
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
                text: 'Quick',
                value: 1.34112      // 3mph in m/s
            },{
                text: 'Average',
                value: 1.1176       // 2.5 mph in m/s
            }, {
                text: 'Slightly Slow',
                value: 0.67056      // 1.5 mph in m/s
            }, {
                text: 'Slow',
                value: 0.44704      // 1 mph in m/s
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
