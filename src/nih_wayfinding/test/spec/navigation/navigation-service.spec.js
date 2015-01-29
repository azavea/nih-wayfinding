'use strict';

describe('nih.notifications: Navigation', function () {

    // load the controller's module
    beforeEach(module('nih.navigation'));

    var rootScope;
    var Navigation;
    var testRoute = [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5]
    ];

    beforeEach(inject(function ($rootScope, $timeout, _Navigation_) {
        rootScope = $rootScope;
        Navigation = _Navigation_;
        Navigation.setRoute(testRoute);
    }));

    it('should broadcast stepFirst when navigating to first position', function () {
        spyOn(rootScope, '$broadcast');
        Navigation.stepFirst();
        rootScope.$apply();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', {
            latitude: testRoute[0][1],
            longitude: testRoute[0][0]
        });
    });

    it('should broadcast stepLast when navigating to first position', function () {
        spyOn(rootScope, '$broadcast');
        Navigation.stepLast();
        rootScope.$apply();
        var index = testRoute.length - 1;
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', {
            latitude: testRoute[index][1],
            longitude: testRoute[index][0]
        });
    });

    it('should broadcast position when stepNext and stepPrevious are called', function () {
        spyOn(rootScope, '$broadcast');
        Navigation.stepNext();
        rootScope.$apply();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', jasmine.any(Object));
        Navigation.stepPrevious();
        rootScope.$apply();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', jasmine.any(Object));
    });
});
