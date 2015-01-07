'use strict';

describe('nih.views.newprofile: NewProfileController', function () {

  // load the controller's module
  beforeEach(module('nih.views.newprofile'));

  var NewProfileController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewProfileController = $controller('NewProfileController', {
      $scope: scope
    });
  }));

  it('should have a display name', function () {
    expect(NewProfileController.displayUsername).toBeDefined();
  });
});
