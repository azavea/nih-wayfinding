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

    var geolocationLat = 10;
    var geolocationLon = 10;
    var stateParamsLat = 20;
    var stateParamsLon = 20;
    var stateParamsArray = [stateParamsLon, stateParamsLat];
    var geolocationArray = [geolocationLon, geolocationLat];
    var stateParamsString = stateParamsArray.join(',');
    var geolocationString = geolocationArray.join(',');

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

    beforeEach(inject(function ($q, $rootScope, _Config_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        geolocation = mockGeolocation($q);
        Config = _Config_;
        Directions = mockDirections($q);
        spyOn(geolocation, 'getCurrentPosition').and.callThrough();
        spyOn(Directions, 'get').and.callThrough();
    }));

    describe('tests where no state params are necessary', function () {
        beforeEach(inject(function ($controller) {
            // TODO: Way to DRY this $controller call?
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                $geolocation: geolocation,
                Config: Config,
                Directions: Directions
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
    });

    describe('tests where state params for destination', function () {
        beforeEach(inject(function ($controller) {
            OverviewController = $controller('OverviewController', {
                $scope: scope,
                $geolocation: geolocation,
                Directions: Directions,
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
                $geolocation: geolocation,
                Directions: Directions,
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
                $geolocation: geolocation,
                Directions: Directions,
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