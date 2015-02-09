(function () {
    'use strict';

    /* ngInject */
    function LocalStorageConfig(localStorageServiceProvider) {

        // set up local storage
        localStorageServiceProvider
            .setPrefix('nih')
            .setStorageType('localStorage')
            .setNotify(false, false);
    }

    angular.module('nih.profiles', [
        'LocalStorageModule',
        'nih.config'
    ]).config(LocalStorageConfig);

})();
