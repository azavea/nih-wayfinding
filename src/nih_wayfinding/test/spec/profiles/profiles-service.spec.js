'use strict';

describe('nih.profiles: ProfileService', function () {

    // load the controller's module
    beforeEach(module('nih.profiles'));

    var ProfileService, profile;
    var testUserName = 'foo';

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_ProfileService_) {
        ProfileService = _ProfileService_;
        profile = ProfileService.createProfile(testUserName);
    }));

    it('should create a new profile', function () {
        expect(profile.username).toBe(testUserName);
    });

    it('should not allow two profiles with the same username', function () {
        var profile2 = ProfileService.createProfile(testUserName);
        expect(profile2).toBeFalsy();
    });

    it('should get profile by username', function () {
        var found = ProfileService.getProfile(testUserName);
        expect(found.username).toBe(testUserName);
    });

    it('should get list of all usernames', function () {

        ProfileService.createProfile('bar');
        ProfileService.createProfile('baz');

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

    it('should set a property on the current user', function () {
        ProfileService.setCurrentUser(testUserName);
        ProfileService.setCurrentUserProperty('answer', 42);
        var user = ProfileService.getCurrentUser();
        expect(user.answer).toBe(42);
    });
});
