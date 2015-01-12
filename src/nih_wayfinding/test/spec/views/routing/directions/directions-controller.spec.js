'use strict';

describe('nih.views.routing: DirectionsController', function () {

    beforeEach(module('nih.mapping'));
    beforeEach(module('nih.routing'));
    beforeEach(module('nih.views.routing'));

    var rootScope;
    var scope;

    var Map;
    var DirectionsController;

    function mockMap(geojson) {
        return {
            geojson: {
                data: geojson
            }
        };
    }

    beforeEach(inject(function ($controller, $q, $rootScope, RoutingResponseStub) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        Map = mockMap(RoutingResponseStub);
        DirectionsController = $controller('DirectionsController', {
            $scope: scope,
            Map: Map
        });
    }));

    it('should ensure that scope functions exist', function () {
        expect(DirectionsController.getLineColor).toBeDefined();
        expect(DirectionsController.getFlagIconName).toBeDefined();
        expect(DirectionsController.getTurnIconName).toBeDefined();
    });

    it('should ensure that geojson is parsed to a list of properties', function () {
        expect(DirectionsController.list.length).toBeGreaterThan(0);
        var item = DirectionsController.list[0];
        expect(item.directions).toBeDefined();
        expect(item.lastModified).toBeDefined();
    });

});