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

    it('should return fractions for values greater than 1000 ft but less than 1 mi', function () {
        var result = filter('distance')(1000);
        expect(result).toEqual('2/3 mi');
    });

    it('should return 1 mi for values between 9/10 and 1 mi', function () {
        var result = filter('distance')(1600);
        expect(result).toEqual('1 mi');
    });

    it('should return decimals for values greater than 1 mi', function () {
        var result = filter('distance')(2000);
        expect(result).toEqual('1.2 mi');
    });
});
