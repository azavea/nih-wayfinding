(function () {
    'use strict';

    /* ngInject */
    function ProfilesController() {
        var self = this;

        self.name = 'Profiles List';
        /*
        // Only need to inject $scope now if you do something with the actual $scope object, like
        //  a watch or an event listener
        // Watch example:
        $scope.$watch(function () {
            self.watchedProperty;
        }, function (newValue) {
            // doSomething with self.watchedProperty
        })
        */
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();