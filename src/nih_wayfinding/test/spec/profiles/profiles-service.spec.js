'use strict';

describe('nih.profiles: ProfileService', function () {

    // load the controller's module
    beforeEach(module('nih.profiles'));

    var ProfileService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_ProfileService_) {
        ProfileService = _ProfileService_;
    }));

    it('should create a new profile', function () {
        var profile = ProfileService.createProfile('foo');
        expect(profile.username).toBe('foo');
    });

    it('should not allow two profiles with the same username', function () {
        ProfileService.createProfile('foo');
        var profile2 = ProfileService.createProfile('foo');
        expect(profile2).toBeFalsy();
    });

    it('should get profile by username', function () {
        ProfileService.createProfile('foo');
        var found = ProfileService.getProfile('foo');
        expect(found.username).toBe('foo');
    });

    it('should get list of all usernames', function () {
        var testUsernames = ['foo', 'bar', 'baz'];
        for (var x in testUsernames) {
            ProfileService.createProfile(testUsernames[x]);
        }

        var haveNames = ProfileService.getProfileNames();

        for (var y in testUsernames) {
            expect(haveNames).toContain(testUsernames[y]);
        }
    });
});
