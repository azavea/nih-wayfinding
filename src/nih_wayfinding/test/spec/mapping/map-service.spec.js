'use strict';

describe('nih.mapping: Map', function () {

    beforeEach(module('nih.mapping'));

    var Map;

    beforeEach(inject(function (_Map_) {
        Map = _Map_;
    }));

    it('should have a set of default properties necessary to initialize the leaflet map', function () {
        expect(Map.bounds).toBeDefined();
        expect(Map.bounds.northEast).toBeDefined();
        expect(Map.bounds.southWest).toBeDefined();
        expect(Map.center).toBeDefined();
        expect(Map.center.lat).toBeDefined();
        expect(Map.center.lng).toBeDefined();
        expect(Map.center.zoom).toBeDefined();
        expect(Map.layers).toBeDefined();
    });

    it('should ensure that geojson is not defined', function () {
        // if geojson is initialized to an empty object, leaflet-directive won't pick up
        // the changes when updated
        expect(Map.geojson).toBeUndefined();
    });
});