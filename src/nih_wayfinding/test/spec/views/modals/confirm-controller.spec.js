'use strict';

describe('nih.views.modals: ConfirmModalController', function () {

  // load the controller's module
  beforeEach(module('nih.views.modals'));

  var ConfirmModalController;
  var modalInstance;
  var rootScope;
  var scope;

  var title = 'title';
  var text = 'text';
  var confirmClass = 'btn-primary';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    modalInstance = {};
    ConfirmModalController = $controller('ConfirmModalController', {
      $scope: scope,
      $modalInstance: modalInstance,
      title: title,
      text: text,
      confirmClass: confirmClass
    });
  }));

  it('should ensure that all injected properties are set on scope', function () {
    expect(ConfirmModalController.title).toEqual(title);
    expect(ConfirmModalController.text).toEqual(text);
    expect(ConfirmModalController.confirmClass).toEqual(confirmClass);
  });
});
