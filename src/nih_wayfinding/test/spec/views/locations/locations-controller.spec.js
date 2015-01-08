'use strict';

describe('nih.views.locations: LocationsController', function () {

  // load the controller's module
  beforeEach(module('nih.views.locations'));
  // load target module
  beforeEach(module('nih.views.routing'));

  var LocationsController;
  var httpBackend;
  var rootScope;
  var scope;
  var state;
  var Geocoder;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $httpBackend, $q, $rootScope, $state) {
    httpBackend = $httpBackend;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    state = $state;
    Geocoder = {
        search: function (searchText) {
            var dfd = $q.defer();
            dfd.resolve([{
                geometry: {
                    x: 10,
                    y: 10
                }
            }]);
            return dfd.promise;
        }
    };
    LocationsController = $controller('LocationsController', {
      $scope: scope,
      Geocoder: Geocoder
    });
  }));

  it('should initialize findAddressExpanded to false', function () {
    expect(LocationsController.findAddressExpanded).toEqual(false);
  });
  it('should initialize searchText to empty string', function () {
    expect(LocationsController.searchText).toEqual('');
  });

  it('should expect search() to trigger a state change to routing', function () {
    spyOn(state, 'transitionTo');
    LocationsController.search();
    rootScope.$digest();        // state change queued in search(), actually happens on next $digest
    expect(state.transitionTo).toHaveBeenCalled();
  });
});