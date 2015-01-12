'use strict';

describe('nih.views.modals: Modals', function () {

    beforeEach(module('nih.views.modals'));

    var Modals;

    beforeEach(inject(function (_Modals_) {
        Modals = _Modals_;
    }));

    it('should ensure openConfirm matches the ui-bootstrap $modal response', function () {
        var modal = Modals.openConfirm({});
        expect(modal.result).toBeDefined();
        expect(modal.dismiss).toBeDefined();
        expect(modal.close).toBeDefined();
        expect(modal.opened).toBeDefined();
    });

    it('should ensure openInput matches the ui-bootstrap $modal response', function () {
        var modal = Modals.openInput({});
        expect(modal.result).toBeDefined();
        expect(modal.dismiss).toBeDefined();
        expect(modal.close).toBeDefined();
        expect(modal.opened).toBeDefined();
    });
});
