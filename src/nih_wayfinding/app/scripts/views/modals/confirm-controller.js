(function () {
    'use strict';

    function ConfirmModalController($scope, $modalInstance, title, text, confirmClass) {
        var ctl = this;
        ctl.title = title;
        ctl.text = text;
        ctl.confirmClass = confirmClass;

        ctl.ok = function () {
            $modalInstance.close();
        };

        ctl.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    angular.module('nih.views.modals')
    .controller('ConfirmModalController', ConfirmModalController);

})();
