'use strict';

describe('nih.views.routing: OverviewController', function () {

  // load the controller's module
  beforeEach(module('nih.views.routing'));

  var OverviewController;
  var rootScope;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    OverviewController = $controller('OverviewController', {
      $scope: scope,
      $stateParams: {
        destination: '20,40'
      }
    });
  }));

  it('should initialize a map object', function () {
    expect(OverviewController.map).toBeDefined();
  });

  // TODO: Add test ensuring Directions.get is called
  // TODO: Add test ensuring $geolocation is requested
});