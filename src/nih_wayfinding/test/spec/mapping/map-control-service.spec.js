'use strict';

describe('nih.mapping: MapControl', function () {

    beforeEach(module('nih.mapping'));

    var MapControl;

    beforeEach(inject(function (_MapControl_) {
        MapControl = _MapControl_;
    }));

    it('should ensure cleanLonLatParam returns null if error', function () {
        expect(MapControl.cleanLonLatParam('20')).toBeNull();
        expect(MapControl.cleanLonLatParam(20)).toBeNull();
        expect(MapControl.cleanLonLatParam(null)).toBeNull();
        expect(MapControl.cleanLonLatParam(undefined)).toBeNull();
        expect(MapControl.cleanLonLatParam('20,abcdge')).toBeNull();
    });

    it('should ensure cleanLonLatParam splits valid string to two floats', function () {
        var lonLat = MapControl.cleanLonLatParam('20,42.42');
        expect(lonLat[0]).toEqual(20);
        expect(lonLat[1]).toEqual(42.42);
    });

    it('should call L.showPopup when a popup is requested for a Point', function () {
        spyOn(L, 'popup').and.callThrough();
        MapControl.showPopup({
            geometry: {
                type: 'Point'
            }
        });
        // Delay to give the leafletData.getMap promise time to resolve, not sure of a way around this?
        setTimeout(function () {
            expect(L.popup).toHaveBeenCalled();
        }, 100);
    });

    it('should NOT call L.showPopup when a popup is requested for not a Point', function () {
        spyOn(L, 'popup').and.callThrough();
        MapControl.showPopup({
            geometry: {
                type: 'LineString'
            }
        });
        // Delay to give the leafletData.getMap promise time to resolve, not sure of a way around this?
        setTimeout(function () {
            expect(L.popup).not.toHaveBeenCalled();
        }, 100);
    });
});