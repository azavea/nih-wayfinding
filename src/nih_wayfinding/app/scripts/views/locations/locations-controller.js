(function () {
    'use strict';

    /* ngInject */
    function LocationsController() {
        this.name = 'Locations List';
    }

    angular.module('nih.views.locations')
    .controller('LocationsController', LocationsController);

})();