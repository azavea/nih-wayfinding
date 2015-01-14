'use strict';

describe('nih.profiles: UserLocationService', function () {

    // load the controller's module
    beforeEach(module('nih.profiles'));

    var UserLocations, ProfileService, profile;
    var testUserName = 'foo';

    // Initialize the profile service
    beforeEach(inject(function (_ProfileService_) {
        ProfileService = _ProfileService_;
        ProfileService.deleteProfile(testUserName);
        profile = ProfileService.createProfile(testUserName);
        ProfileService.setCurrentUser(testUserName);
    }));

    // Initialize the profile service
    beforeEach(inject(function (_UserLocations_) {
        UserLocations = _UserLocations_;
    }));

    it('should initially have an undefined workingLocation', function () {
        expect(UserLocations.workingLocation).toBe(null);
    });

    it('should revert workingLocation to undefined upon addlocation call', function () {
        UserLocations.workingLocation = { id: 1 };
        UserLocations.addLocation(UserLocations.workingLocation);
        expect(UserLocations.workingLocation).toEqual(null);
    });

    it('should get profile by username', function () {
        UserLocations.addLocation(UserLocations.newLocation());
        expect(UserLocations.newLocation()).toEqual({ id: 2 });
    });

    it('should be able to retrieve a location by ID', function () {
        UserLocations.addLocation(UserLocations.newLocation());
        UserLocations.addLocation(UserLocations.newLocation());

        var testLocation = UserLocations.newLocation();
        testLocation.text = 'just some text';
        UserLocations.addLocation(testLocation);

        expect(UserLocations.getLocationByID(3).text).toEqual('just some text');
    });

    it('should delete a specified location by ID', function () {
        UserLocations.addLocation(UserLocations.newLocation());
        UserLocations.addLocation(UserLocations.newLocation());
        var loc3 = UserLocations.newLocation();
        loc3.text = 'testString';
        UserLocations.addLocation(loc3);
        UserLocations.addLocation(UserLocations.newLocation());
        UserLocations.removeLocation(testUserName, 3);

        expect(UserLocations.getLocationByID(3)).toEqual(undefined);
    });
});
