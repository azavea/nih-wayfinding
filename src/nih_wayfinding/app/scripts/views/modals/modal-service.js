(function () {
    'use strict';

    function ModalService($modal) {
        var module = {
            openConfirm: openConfirm
        };

        return module;

        /**
         * Open a confirm dialog with the options provided
         * @param  {object} options Set of options to pass to the controller. See defaults for choices.
         * @return {promise}  Promise matching the promise returned by the bootstrap $modal service
         */
        function openConfirm(options) {
            var defaults = {
                title: 'Are you sure?',
                text: null,
                confirmClass: 'btn-primary',
                size: 'sm'
            };
            var config = angular.extend({}, defaults, options);
            return $modal.open({
                templateUrl: 'scripts/views/modals/confirm-partial.html',
                controller: 'ConfirmModalController',
                controllerAs: 'modal',
                size: config.size,
                resolve: {
                    title: function () {
                        return config.title;
                    },
                    text: function () {
                        return config.text;
                    },
                    confirmClass: function () {
                        return config.confirmClass;
                    }
                }
            });
        }
    }

    angular.module('nih.views.modals')
    .factory('Modals', ModalService);
})();
