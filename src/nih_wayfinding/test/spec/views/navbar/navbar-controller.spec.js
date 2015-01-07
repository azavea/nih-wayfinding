'use strict';

describe('nih.views.navbar: NavbarController', function () {

  // load the controller's module
  beforeEach(module('nih.views.navbar'));

  var NavbarController;
  var NavbarConfig;
  var rootScope;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _NavbarConfig_) {
    NavbarConfig = _NavbarConfig_;
    rootScope = $rootScope;
    scope = $rootScope.$new();
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
});