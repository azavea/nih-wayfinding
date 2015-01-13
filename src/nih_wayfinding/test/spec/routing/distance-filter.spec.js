'use strict';

describe('nih.routing: Filters', function () {

    beforeEach(module('nih.routing'));

    var filter;

    beforeEach(inject(function ($filter) {
        filter = $filter;
    }));

    it('should return empty string for NaN', function () {
        var result = filter('distance')(null);
        expect(result).toEqual('');
    });

    it('should return ft for values less than 1000 ft', function () {
        var result = filter('distance')(200);
        expect(result).toEqual('656 ft');
    });

    it('should return mi for values greater than 1000 ft', function () {
        var result = filter('distance')(400);
        expect(result).toEqual('0.2 mi');
    });
});
