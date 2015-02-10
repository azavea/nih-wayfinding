
'use strict';

describe('nih.routing: Filters Abbreviate', function () {

    beforeEach(module('nih.routing'));

    var filter;

    var addressCase1 = 'North Baltimore Avenue';
    var addressWhitespace = '  North  \n  Baltimore    \t Avenue     ';
    var addressCase2 = 'Baltimore Avenue North';
    var addressCase3 = 'Baltimore Avenue';

    beforeEach(inject(function ($filter) {
        filter = $filter;
    }));

    it('should return same as input on bad input', function () {
        var result = filter('abbreviate')(null);
        expect(result).toEqual(null);

        result = filter('abbreviate')(1000);
        expect(result).toEqual(1000);

        result = filter('abbreviate')('');
        expect(result).toEqual('');
    });

    it('should handle extra whitespace', function () {
        var result = filter('abbreviate')(addressWhitespace);
        expect(result).toEqual('N Baltimore Ave');
    });

    it('should handle the standard cases', function () {
        var result = filter('abbreviate')(addressCase1);
        expect(result).toEqual('N Baltimore Ave');

        result = filter('abbreviate')(addressCase2);
        expect(result).toEqual('Baltimore Ave N');

        result = filter('abbreviate')(addressCase3);
        expect(result).toEqual('Baltimore Ave');
    });

    it('should handle starting the address with a number', function () {
        var result = filter('abbreviate')('1000 ' + addressCase1);
        expect(result).toEqual('1000 N Baltimore Ave');
    });

});
