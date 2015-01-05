(function () {
    'use strict';

    /* ngInject */
    function LocationsController() {
        var ctl = this;
        ctl.name = 'Locations List';
    }

    angular.module('nih.views.locations')
    .controller('LocationsController', LocationsController);

})();