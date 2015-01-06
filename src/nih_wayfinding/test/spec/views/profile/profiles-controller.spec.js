'use strict';

describe('nih.views.profile: ProfilesController', function () {

  // load the controller's module
  beforeEach(module('nih.views.profile'));

  var ProfilesController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilesController = $controller('ProfilesController', {
      $scope: scope
    });
  }));

  it('should have a name', function () {
    expect(ProfilesController.name).toBeDefined();
  });
});
