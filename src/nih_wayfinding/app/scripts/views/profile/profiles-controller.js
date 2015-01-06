(function () {
    'use strict';

    /* ngInject */
    function ProfilesController(ProfileService) {
        var ctl = this;
        ctl.name = 'Profiles List';

        ProfileService.createProfile('Donald');
        ProfileService.createProfile('Mickey');
        ProfileService.createProfile('Minnie');

        ctl.usernames = ProfileService.getProfileNames();

        /*
        // Only need to inject $scope now if you do something with the actual $scope object, like
        //  a watch or an event listener
        // Watch example:
        $scope.$watch(function () {
            ctl.watchedProperty;
        }, function (newValue) {
            // doSomething with ctl.watchedProperty
        })
        */
    }

    angular.module('nih.views.profile')
    .controller('ProfilesController', ProfilesController);

})();
