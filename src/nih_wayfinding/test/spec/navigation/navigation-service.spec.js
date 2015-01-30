'use strict';

describe('nih.notifications: Navigation', function () {

    // load the controller's module
    beforeEach(module('nih.navigation'));

    var rootScope;
    var Navigation;
    var linestring = turf.linestring([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5]
    ]);
    var firstPoint = turf.point(linestring.geometry.coordinates[0]);
    var lastIndex = linestring.geometry.coordinates.length - 1;
    var lastPoint = turf.point(linestring.geometry.coordinates[lastIndex]);
    var testRoute = turf.featurecollection([linestring]);

    beforeEach(inject(function ($rootScope, $timeout, _Navigation_) {
        rootScope = $rootScope;
        Navigation = _Navigation_;
        Navigation.setRoute(testRoute);
    }));

    it('should broadcast position when stepNext and stepPrevious are called', function () {
        spyOn(rootScope, '$broadcast');
        Navigation.stepNext();
        rootScope.$apply();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', jasmine.any(Object));
        Navigation.stepPrevious();
        rootScope.$apply();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.navigation.positionUpdated', {
            point: firstPoint,
            properties: jasmine.any(Object),
            destination: lastPoint
        });
    });
});
