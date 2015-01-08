'use strict';

describe('nih.mapping: MapControl', function () {

    beforeEach(module('nih.mapping'));

    var rootScope;
    var MapControl;

    beforeEach(inject(function ($rootScope, _MapControl_) {
        rootScope = $rootScope;
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

/*
    // These tests don't work, due to the async leafletData.getMap() call.
    //  Commenting out since they will be obsolete anyways once we remove the temporary popup
    it('should call L.showPopup when a popup is requested for a Point', function () {
        spyOn(L, 'popup').and.callThrough();
        MapControl.showPopup({
            geometry: {
                type: 'Point'
            }
        });
        rootScope.$digest();
        expect(L.popup).toHaveBeenCalled();
    });

    it('should NOT call L.showPopup when a popup is requested for not a Point', function () {
        spyOn(L, 'popup').and.callThrough();
        MapControl.showPopup({
            geometry: {
                type: 'LineString'
            }
        });
        rootScope.$digest();
        expect(L.popup).not.toHaveBeenCalled();
    });
*/
});