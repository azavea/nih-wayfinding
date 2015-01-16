'use strict';

describe('nih.profiles: ProfileService', function () {

    // load the controller's module
    beforeEach(module('nih.profiles'));

    var ProfileService, profile;
    var testUserName = 'foo';

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_ProfileService_) {
        ProfileService = _ProfileService_;
        ProfileService.deleteProfile(testUserName);
        profile = ProfileService.createBaseProfile();
        profile.username = testUserName;
        profile.save();
    }));

    it('should create a new profile', function () {
        expect(ProfileService.fetchProfile(testUserName).username).toEqual(testUserName);
    });

    it('should not allow two profiles with the same username', function () {
        var profile2 = ProfileService.createBaseProfile(testUserName);
        profile2.username = testUserName;
        expect(profile2.save()).toBeFalsy();
    });

    it('should get profile by username', function () {
        var found = ProfileService.fetchProfile(testUserName);
        expect(found.username).toBe(testUserName);
    });

    it('should get list of all usernames', function () {

        var profile2 = ProfileService.createBaseProfile();
        profile2.username = 'bar';
        profile2.save();

        var profile3 = ProfileService.createBaseProfile();
        profile3.username = 'baz';
        profile3.save();

        var haveNames = ProfileService.getProfileNames();

        var testUsernames = [testUserName, 'bar', 'baz'];
        for (var y in testUsernames) {
            expect(haveNames).toContain(testUsernames[y]);
        }
    });

    it('should set and get current user', function () {
        ProfileService.setCurrentUser(testUserName);
        var user = ProfileService.getCurrentUser();
        expect(user.username).toBe(testUserName);
    });

    it('should delete the specified user', function () {
        var found = ProfileService.fetchProfile(testUserName);
        expect(found.username).toBe(testUserName);
        ProfileService.deleteProfile(testUserName);
        found = ProfileService.fetchProfile(testUserName);
        expect(found.transient).toEqual(true);
    });

    it('should delete the currentUser if currentUser is deleted', function () {
        ProfileService.setCurrentUser(testUserName);
        ProfileService.deleteProfile(testUserName);
        expect(ProfileService.getCurrentUser().transient).toEqual(true);
    });

    it('should set a property on the current user', function () {
        ProfileService.setCurrentUser(testUserName);
        var user = ProfileService.getCurrentUser();
        user.answer = 42;
        expect(user.answer).toBe(42);
        user.setProperty('otherAnswer', 'the transcendental deduction of the categories of understanding');
        expect(user.otherAnswer).toBe('the transcendental deduction of the categories of understanding');
    });

    it('should be capable of spinning up a temporary location', function () {
        profile.startLocation();
        expect(profile.tempLocation.text).toEqual(null);
    });

    it('oughtta reliably generate the next id', function () {
        profile.startLocation();
        expect(profile.tempLocation.id).toEqual(1);
        profile.finishLocation();

        profile.startLocation();
        expect(profile.tempLocation.id).toEqual(2);

        profile.finishLocation();
        expect(profile.newLocationID()).toEqual(3);
    });

    it('should move tempLocation into locations', function () {
        profile.startLocation();
        profile.finishLocation();

        profile.startLocation();
        var temp = profile.tempLocation;
        profile.finishLocation();
        expect(profile.locations[1]).toEqual(temp);
    });

    it('should set a property of tempLocation and, later, find that location', function () {
        profile.startLocation();
        profile.finishLocation();

        profile.startLocation();
        profile.extendTempLocation('zipzap', 'flimflam');
        expect(profile.tempLocation.zipzap).toEqual('flimflam');
        profile.finishLocation();
        expect(profile.locationByID(2).zipzap).toEqual('flimflam');
    });

    it('should set a property of tempLocation and, later, find that location', function () {
        profile.startLocation();
        profile.finishLocation();
        profile.startLocation();
        profile.finishLocation();
        profile.removeLocation(2);
        expect(profile.locations.length).toEqual(1);
    });

});
