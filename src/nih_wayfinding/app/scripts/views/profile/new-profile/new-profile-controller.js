(function () {
    'use strict';

    /* ngInject */
    function NewProfileController($state, ProfileService, ProfilePreferenceOptions, Notifications) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.step = 1;
            ctl.setStep = setStep;
            ctl.newUser = ProfileService.createBlankProfile();

            ctl.errorMsg = '';
            ctl.displayUsername = '';

            // Functions and values pertaining to questionnaire
            ctl.preferenceOpts = ProfilePreferenceOptions;
            ctl.checkUsername = checkUsername;
            ctl.setUsingWheelchair = setUsingWheelchair;
            ctl.wheelchairTypeDialog = false;
            ctl.setWheelchairType = setWheelchairType;
            ctl.setChallengeLevel = setChallengeLevel;
            ctl.setSteepTerrainComfort = setSteepTerrainComfort;
            ctl.setSpeed = setSpeed;
            ctl.setPeace = setPeace;
            ctl.setRestFrequency = setRestFrequency;
            ctl.willCreateLocations = willCreateLocations;
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
        function setUsingWheelchair(amUsing) {
            ctl.newUser.setPreference('wheelchairRequired', amUsing.value);
            if (amUsing.value) {
                ctl.wheelchairTypeDialog = true;
            } else {
                ctl.setWheelchairType({ value: null });
            }
        }

        /**
         * Set private var for whether using a wheelchair or scooter.
        */
        function setWheelchairType(chairType) {
            ctl.newUser.setPreference('wheelchairPowered', chairType.value);
            setStep(3);
        }

        /**
         * Set private var for profile challenge level.
         */
        function setChallengeLevel(challenge) {
            ctl.newUser.setPreference('challenge', challenge.value);
            setStep(4);
        }

        /**
         * Set private var for profile steepTerrainComfort level.
         */
        function setSteepTerrainComfort(comfort) {
            ctl.newUser.setPreference('steepTerrainComfort', comfort.value);
            setStep(5);
        }

        /**
         * Set private var for profile speed.
         */
        function setSpeed(speed) {
            ctl.newUser.setPreference('speed', speed.value);
            setStep(6);
        }

        /**
         * Set private var for profile speed.
         */
        function setPeace(peace) {
            ctl.newUser.setPreference('peace', peace.value);
            setStep(7);
        }

        /**
         * Set private var for profile speed.
         */
        function setRestFrequency(frequency) {
            ctl.newUser.setPreference('restFrequency', frequency.value);
            setStep(8);
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
            ctl.newUser.username = ctl.username;
            if (ctl.newUser.save()) {
                ProfileService.setCurrentUser(ctl.username);
            } else {
                Notifications.show({
                    text: 'There was a problem saving this profile. Make sure the username is unique.',
                    timeout: 3000
                });
            }
        }

        /*k
         *
         * Check entered username is valid, and set error message if not.
         */
        function checkUsername() {
            if (!ctl.username) {
                ctl.errorMsg = 'User name is required';
                return; // 'required' check will set validity
            }

            if (ProfileService.profileExists(ctl.username)) {
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
