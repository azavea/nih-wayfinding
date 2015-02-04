'use strict';

describe('nih.geocoder: Geocoder', function () {



    // load the controller's module
    beforeEach(module('nih.geocoder'));

    var httpBackend;
    var Geocoder;
    var searchUrl = /\/arcgis\/rest\/services\/World\/GeocodeServer\/find\?.*/;
    var searchResponse = {
        locations: [{
            feature: {
                attributes: {
                    city: 'New York'
                },
                geometry: {
                    x: 100.0,
                    y: 200.0
                }
            }
        }, {
            feature: {
                attributes: {
                    city: 'Philadelphia'
                },
                geometry: {
                    x: 100.0,
                    y: 200.0
                }
            }
        }]
    };
    var suggestUrl = /\/arcgis\/rest\/services\/World\/GeocodeServer\/suggest\?.*/;
    var suggestResponse = {
        suggestions: [{
            text: 'one',
            magicKey: 'one',
            isCollection: false
        }, {
            text: 'two',
            magicKey: 'two',
            isCollection: false
        }]
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($httpBackend, _Geocoder_) {
        httpBackend = $httpBackend;
        Geocoder = _Geocoder_;
    }));

    it('should ensure suggest returns an array of objects with text and magicKey keys', function () {
        var suggestions = [{
            text: 'one',
            magicKey: 'one'
        }, {
            text: 'two',
            magicKey: 'two'
        }];
        httpBackend.whenGET(suggestUrl).respond(suggestResponse);
        Geocoder.suggest('one').then(function (response) {
            expect(response).toEqual(suggestions);
        });
        httpBackend.flush();
    });

    it('should ensure search returns an array of features', function () {
        httpBackend.whenGET(searchUrl).respond(searchResponse);
        Geocoder.search('one').then(function (response) {
            expect(response.length).toEqual(2);
            expect(response[0].attributes).toBeDefined();
            expect(response[0].geometry).toBeDefined();
        });
        httpBackend.flush();
    });
});