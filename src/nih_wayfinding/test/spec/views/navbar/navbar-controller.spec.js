'use strict';

describe('nih.views.navbar: NavbarController', function () {

  // load the controller's module
  beforeEach(module('nih.views.navbar'));

  var NavbarController;
  var NavbarConfig;
  var Notifications;
  var rootScope;
  var scope;
  var timeout;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $timeout, _NavbarConfig_, _Notifications_) {
    NavbarConfig = _NavbarConfig_;
    Notifications = _Notifications_;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    timeout = $timeout;
    NavbarController = $controller('NavbarController', {
      $scope: scope
    });
  }));

  it('should update its title when the NavbarConfig changes', function () {
    var title = NavbarController.config.title;
    var anotherTitle = 'Another random title';
    expect(title).not.toEqual(anotherTitle);
    expect(title).toBeDefined();
    NavbarConfig.set({ title: anotherTitle});
    expect(NavbarConfig.config.title).toEqual(anotherTitle);
  });

  it('should ensure an event is fired when NavbarConfig.set() is called', function () {
    spyOn(rootScope, '$broadcast');
    NavbarConfig.set({title: 'A title'});
    expect(rootScope.$broadcast).toHaveBeenCalledWith(NavbarConfig.events.updated);
  });

  it('should ensure alertHeight gets set on showAlert', function () {
    var testText = 'test';
    expect(NavbarController.alertHeight).toEqual(0);
    Notifications.show({text: testText});
    rootScope.$digest();
    expect(NavbarController.alert.text).toEqual(testText);
    expect(NavbarController.alertHeight).toBeGreaterThan(0);
  });

  it('should ensure an alert that times out gets hidden automatically', function () {
    var testText = 'test';
    var timeoutDuration = 500;
    Notifications.show({text: testText, timeout: timeoutDuration});
    rootScope.$digest();
    timeout.flush(timeoutDuration - 100);
    expect(NavbarController.alertHeight).toBeGreaterThan(0);
    timeout.flush(timeoutDuration);
    expect(NavbarController.alertHeight).toEqual(0);
  });

  it('should ensure that the timeout is cleared and the alert is hidden ' +
     'when an alert with timeout is hidden manually', function () {
    var testText = 'test';
    var timeoutDuration = 500;
    Notifications.show({text: testText, timeout: timeoutDuration});
    rootScope.$digest();
    timeout.flush(timeoutDuration / 2);
    expect(NavbarController.alertHeight).toBeGreaterThan(0);
    NavbarController.hideAlert();
    expect(NavbarController.alertHeight).toEqual(0);
    timeout.verifyNoPendingTasks();
  });
});