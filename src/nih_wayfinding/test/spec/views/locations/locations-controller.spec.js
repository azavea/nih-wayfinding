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
    var Notifications;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($httpBackend, $rootScope, $state, _Notifications_) {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        state = $state;
        Notifications = _Notifications_;
    }));

    describe('tests where geocoder returns valid response', function () {
        beforeEach(inject(function ($controller, $q) {
            Geocoder = {
                search: function () {
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
                Geocoder: Geocoder,
                Notifications: Notifications
            });
        }));

        it('should initialize findAddressExpanded to false', function () {
            expect(LocationsController.findAddressExpanded).toEqual(false);
        });

        it('should expect search() to trigger a state change to routing', function () {
            spyOn(state, 'transitionTo');
            LocationsController.search();
            rootScope.$digest();        // state change queued in search(), actually happens on next $digest
            expect(state.transitionTo).toHaveBeenCalled();
        });
    });

    describe('tests where the geocoder returns an empty response', function () {
        beforeEach(inject(function ($controller, $q) {
            Geocoder = {
                search: function () {
                    var dfd = $q.defer();
                    dfd.resolve([]);
                    return dfd.promise;
                }
            };
            LocationsController = $controller('LocationsController', {
                $scope: scope,
                Geocoder: Geocoder,
                Notifications: Notifications
            });
        }));

        it('should show a notification when the geocoder returns no data', function () {
            spyOn(Notifications, 'show');
            LocationsController.search();
            rootScope.$digest();
            expect(Notifications.show).toHaveBeenCalled();
        });
    });


});