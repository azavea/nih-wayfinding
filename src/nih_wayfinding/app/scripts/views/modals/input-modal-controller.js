
(function () {
    'use strict';

    function InputModalController($scope, $modalInstance, title, label) {
        var ctl = this;
        ctl.title = title;
        ctl.label = label;
        ctl.value = '';

        ctl.ok = function () {
            $modalInstance.close(ctl.value);
        };

        ctl.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    angular.module('nih.views.modals')
    .controller('InputModalController', InputModalController);

})();