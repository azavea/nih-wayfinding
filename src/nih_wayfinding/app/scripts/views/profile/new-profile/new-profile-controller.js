(function () {
    'use strict';

    /* ngInject */
    function NewProfileController($state, ProfileService) {

        var ctl = this;
        var usingWheelchairScooter = false;
        var challengeLevel = 2;

        initialize();

        /**
         * Progress through the form sections.
         */
        function setStep(step) {
            ctl.displayUsername = ctl.username;
            ctl.step = step;
        }

        /**
         * Set private var for whether using a wheelchair or scooter.
        */
        function usingWheelchair(amUsing) {
            usingWheelchairScooter = amUsing;
            setStep(3);
        }

        function setChallengeLevel(level) {
            challengeLevel = level;
            createNewUser();
        }

        function createNewUser() {
            ProfileService.createProfile(ctl.username);
            ProfileService.setCurrentUser(ctl.username);
            ProfileService.setUserProperty('wheelchair', usingWheelchairScooter);
            ProfileService.setUserProperty('challenge', challengeLevel);
            $state.go('profiles');
        }

        /**
         * Check entered username is valid, and set error message if not.
         */
        function checkUsername() {
            if (!ctl.username) {
                ctl.errorMsg = 'User name is required';
                return; // 'required' check will set validity
            }

            if (ProfileService.getProfile(ctl.username)) {
                ctl.errorMsg = 'User already exists';
                ctl.newusername.$setValidity('newprofile.username', false);
            } else {
                ctl.errorMsg = '';
                ctl.newusername.$setValidity('newprofile.username', true);
            }
        }

        function initialize() {
            ctl.step = 1;
            ctl.setStep = setStep;
            ctl.checkUsername = checkUsername;
            ctl.usingWheelchair = usingWheelchair;
            ctl.setChallengeLevel = setChallengeLevel;
            ctl.errorMsg = '';
            ctl.displayUsername = '';
        }
    }

    angular.module('nih.views.newprofile')
    .controller('NewProfileController', NewProfileController);

})();
