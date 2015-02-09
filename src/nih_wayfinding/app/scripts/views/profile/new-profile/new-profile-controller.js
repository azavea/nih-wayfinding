(function () {
    'use strict';

    /* ngInject */
    function NewProfileController($state, ProfileService, ProfilePreferenceOptions, Notifications) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.step = 1;
            ctl.setStep = setStep;
            ctl.newUser = ProfileService.createNewProfile();
            ctl.errorMsg = '';
            ctl.displayUsername = '';

            // Functions and values pertaining to questionnaire
            ctl.preferenceOpts = ProfilePreferenceOptions;
            ctl.checkUsername = checkUsername;
            ctl.setUsingAssistance = setUsingAssistance;
            ctl.assistanceTypeDialog = false;
            ctl.setAssistanceType = setAssistanceType;
            ctl.setSurfaceTypeComfort = setSurfaceTypeComfort;
            ctl.setSpeed = setSpeed;
            ctl.setBusyness = setBusyness;
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
        function setUsingAssistance(amUsing) {
            ctl.newUser.setPreference('assistanceRequired', amUsing.value);
            if (amUsing.value) {
                ctl.assistanceTypeDialog = true;
            } else {
                ctl.setAssistanceType({ value: null });
            }
        }

        /**
         * Set private var for whether using a wheelchair or scooter.
        */
        function setAssistanceType(assistanceType) {
            ctl.newUser.setPreference('assistanceType', assistanceType.value);
            setStep(3);
        }

        /**
         * Set private var for profile surfaceTypeComfort level.
         */
        function setSurfaceTypeComfort(comfort) {
            ctl.newUser.setPreference('surfaceTypeComfort', comfort.value);
            setStep(4);
        }

        /**
         * Set private var for profile speed.
         */
        function setSpeed(speed) {
            ctl.newUser.setPreference('speed', speed.value);
            setStep(5);
        }

        /**
         * Set private var for profile speed.
         */
        function setBusyness(busy) {
            ctl.newUser.setPreference('busy', busy.value);
            setStep(6);
        }

        /**
         * Set private var for profile speed.
         */
        function setRestFrequency(frequency) {
            ctl.newUser.setPreference('restFrequency', frequency.value);
            setStep(7);
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
                console.log(ctl.newUser);
                /////////////////////////////////
            } else {
                Notifications.show({
                    text: 'There was a problem saving this profile. Make sure the username is unique.'
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
