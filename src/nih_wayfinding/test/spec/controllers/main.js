'use strict';

describe('Controller: ProfilesController', function () {

  // load the controller's module
  beforeEach(module('nih'));

  var ProfilesCtrl;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilesCtrl = $controller('ProfilesController', {
      $scope: scope
    });
  }));

  it('should have a name', function () {
    expect(ProfilesCtrl.name).toBeDefined();
  });
});
