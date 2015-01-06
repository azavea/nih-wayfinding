'use strict';

describe('nih.geocoder: Geocoder', function () {



    // load the controller's module
    beforeEach(module('nih.geocoder'));

    var httpBackend;
    var Geocoder;
    var searchUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
    var searchResponse = {
        locations: [
        ]
    };
    var suggestUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?category=Address,Postal&f=pjson&searchExtent=-87.940101,41.643919,-87.523984,42.023022&text=one';
    var suggestResponse = {
        suggestions: [{
            text: 'one'
        }, {
            text: 'two'
        }]
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($httpBackend, _Geocoder_) {
        httpBackend = $httpBackend;
        Geocoder = _Geocoder_;
    }));

    it('should ensure suggest returns an array of strings', function () {
        httpBackend.whenGET(suggestUrl).respond(suggestResponse);
        Geocoder.suggest('one').then(function (response) {
            expect(response).toEqual(['one', 'two']);
        });
        httpBackend.flush();
    });
});