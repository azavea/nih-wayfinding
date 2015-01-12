
'use strict';

describe('nih.views.modals: InputModalController', function () {

  // load the controller's module
  beforeEach(module('nih.views.modals'));

  var InputModalController;
  var modalInstance;
  var rootScope;
  var scope;

  var title = 'title';
  var label = 'label';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    modalInstance = {};
    InputModalController = $controller('InputModalController', {
      $scope: scope,
      $modalInstance: modalInstance,
      title: title,
      label: label
    });
  }));

  it('should ensure that all injected properties are set on scope', function () {
    expect(InputModalController.title).toEqual(title);
    expect(InputModalController.label).toEqual(label);
  });
});