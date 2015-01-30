'use strict';

describe('nih.views.routing: OverviewController', function () {

    // load the controller's module
    beforeEach(module('nih.views.routing'));

    var rootScope;
    var scope;

    var geolocation;

    var Config;
    var Directions;
    var OverviewController;
    var MapControl;

    var geolocationLat = 10;
    var geolocationLon = 10;
    var stateParamsLat = 20;
    var stateParamsLon = 20;
    var stateParamsArray = [stateParamsLon, stateParamsLat];
    var geolocationArray = [geolocationLon, geolocationLat];
    var stateParamsString = stateParamsArray.join(',');
    var graphBounds = {'type':'Polygon','coordinates':[[[-87.5753,41.6638,0.0],[-87.6065,41.7074,0.0],[-87.5985,41.7588,0.0],[-87.5912,41.7733,0.0],[-87.5716,41.7735,0.0],[-87.5435,41.7591,0.0],[-87.5418,41.7577,0.0],[-87.5303,41.7404,0.0],[-87.5299,41.7395,0.0],[-87.5247,41.7266,0.0],[-87.5179,41.7025,0.0],[-87.5316,41.6828,0.0],[-87.534,41.6809,0.0],[-87.5753,41.6638,0.0]]]};

    function mockGeolocation($q) {
        return {
            getCurrentPosition: function (options) {
                var dfd = $q.defer();
                dfd.resolve({
                    coords: {
                        latitude: geolocationLat,
                        longitude: geolocationLon
                    }
                });
                return dfd.promise;
            }
        };
    }
    function mockDirections($q) {
        return {
            get: function (origin, destination, options) {
                var dfd = $q.defer();
                dfd.resolve({});
                return dfd.promise;
            },
            isAudited: function () {
                return false;
            }
        };
    }

    function mockBounds($q) {
        return function() {
            var dfd = $q.defer();
            dfd.resolve(graphBounds);
            return dfd.promise;
        };
    }

    beforeEach(inject(function ($q, $rootScope, _Config_, _MapControl_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        geolocation = mockGeolocation($q);
        Config = _Config_;
        Directions = mockDirections($q);
        MapControl = _MapControl_;
        MapControl.getGraphBounds = mockBounds($q);
        spyOn(geolocation, 'getCurrentPosition').and.callThrough();
        spyOn(Directions, 'get').and.callThrough();
        spyOn(MapControl, 'getGraphBounds').and.callThrough();
    }));

    describe('tests where no state params are necessary', function () {
        beforeEach(inject(function ($controller) {
            // TODO: Way to DRY this $controller call?
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                Navigation: geolocation,
                Config: Config,
                Directions: Directions,
                MapControl: MapControl
            });
        }));

        it('should initialize a map object', function () {
            expect(OverviewController.map).toBeDefined();
        });

        it('should ensure ctl.map is initialized to Config.bounds and Config.center', function () {
            expect(OverviewController.map.center).toEqual(Config.center);
            expect(OverviewController.map.bounds).toEqual(Config.bounds);
        });

        it('should ensure getDirections is called with origin -> geolocation, destination -> geolocation', function () {
            rootScope.$digest();
            expect(geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(Directions.get).toHaveBeenCalledWith(geolocationArray, geolocationArray, jasmine.any(Object));
        });

        it('should fetch the graph bounds', function () {
            expect(MapControl.getGraphBounds).toHaveBeenCalled();
        });
    });

    describe('tests where state params for destination', function () {
        beforeEach(inject(function ($controller) {
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                Navigation: geolocation,
                Directions: Directions,
                MapControl: MapControl,
                $stateParams: {
                    destination: stateParamsString
                }
            });
        }));

        it('should ensure getDirections is called with origin -> geolocation, destination -> stateParams', function () {
            rootScope.$digest();
            expect(geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(Directions.get).toHaveBeenCalledWith(geolocationArray, stateParamsArray, jasmine.any(Object));
        });
    });

    describe('tests where state params for origin', function () {
        beforeEach(inject(function ($controller) {
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                Navigation: geolocation,
                Directions: Directions,
                MapControl: MapControl,
                $stateParams: {
                    origin: stateParamsString
                }
            });
        }));

        it('should ensure getDirections is called with origin -> stateParams, destination -> geolocation', function () {
            rootScope.$digest();
            expect(geolocation.getCurrentPosition).toHaveBeenCalled();
            expect(Directions.get).toHaveBeenCalledWith(stateParamsArray, geolocationArray, jasmine.any(Object));
        });
    });

    describe('tests where state params for origin + destination', function () {
        beforeEach(inject(function ($controller) {
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                Navigation: geolocation,
                Directions: Directions,
                MapControl: MapControl,
                $stateParams: {
                    origin: stateParamsString,
                    destination: stateParamsString
                }
            });
        }));

        it('should ensure getDirections is called with origin -> stateParams, destination -> stateParams', function () {
            rootScope.$digest();
            expect(geolocation.getCurrentPosition).not.toHaveBeenCalled();
            expect(Directions.get).toHaveBeenCalledWith(stateParamsArray, stateParamsArray, jasmine.any(Object));
        });
    });
});
