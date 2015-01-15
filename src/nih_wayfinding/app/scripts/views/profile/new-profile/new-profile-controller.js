(function () {
    'use strict';

    /* ngInject */
    function NewProfileController($state, ProfileService) {

        var ctl = this;
        var usingWheelchairScooter = false;
        var challengeLevel = 2;

        initialize();

        function initialize() {
            ctl.step = 1;
            ctl.setStep = setStep;
            ctl.checkUsername = checkUsername;
            ctl.usingWheelchair = usingWheelchair;
            ctl.setChallengeLevel = setChallengeLevel;
            ctl.willCreateLocations = willCreateLocations;
            ctl.errorMsg = '';
            ctl.displayUsername = '';

            ctl.yesNoOpts = [{
                text: 'Yes',
                value: true
            }, {
                text: 'No',
                value: false
            }];

            ctl.newLocOpts = [{
                text: 'Create locations',
                value: true
            }, {
                text: 'No thanks',
                value: false
            }];

            ctl.challengeOpts = [{
                text: 'Minimal',
                value: 1
            }, {
                text: 'Moderate',
                value: 5
            }, {
                text: 'Challenge Me',
                value: 10
            }];
        }
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
            usingWheelchairScooter = amUsing.value;
            setStep(3);
        }

        /**
         * Set private var for profile challenge level.
         */
        function setChallengeLevel(level) {
            challengeLevel = level.value;
            setStep(4);
        }

        /**
         * Decide whether or not to create new locations
         */
        function willCreateLocations(willCreate) {
            createNewUser();
            if (willCreate.value) {
                $state.go('locationsSelectType');
            } else {
                $state.go('locations');
            }
        }

        /**
         * Create the new user profile when form completed, set current user to the new user,
         * then go back to the main profiles page.
         */
        function createNewUser() {
            ProfileService.createProfile(ctl.username);
            ProfileService.setCurrentUser(ctl.username);
            ProfileService.setCurrentUserProperty('wheelchair', usingWheelchairScooter);
            ProfileService.setCurrentUserProperty('challenge', challengeLevel);
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

    }

    angular.module('nih.views.newprofile')
    .controller('NewProfileController', NewProfileController);

})();
