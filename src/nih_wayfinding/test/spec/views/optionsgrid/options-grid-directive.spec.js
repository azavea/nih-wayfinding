'use strict';

describe('nih.views.locations: LocationsController', function () {

  // load target module
  beforeEach(module('nih.profiles'));
  beforeEach(module('nih.views.optionsgrid'));

  var rootScope;
  var scope;
  var element;
  var options;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($compile, $rootScope, UserLocationsStub) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    options = UserLocationsStub;
    scope.options = options;
    scope.optionClicked = function (option) {};
    element = $compile('<nih-options-grid options=options on-option-clicked="optionClicked(option)"></nih-options-grid>')(scope);
  }));

  it('should fire an event that returns the object when a button is clicked', function () {
    spyOn(scope, 'optionClicked');

    // get the first button and click it
    rootScope.$digest();
    var buttons = element.find('button');
    angular.element(buttons[0]).triggerHandler('click');

    rootScope.$digest();
    expect(scope.optionClicked).toHaveBeenCalledWith(options[0]);
  });

});
