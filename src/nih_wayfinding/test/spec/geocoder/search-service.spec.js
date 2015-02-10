'use strict';

describe('nih.geocoder: Geocoder', function () {



    // load the controller's module
    beforeEach(module('nih.geocoder'));

    var httpBackend;
    var Geocoder;
    var MapControl;
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
    var graphBounds = {'type':'Polygon','coordinates':[[[-87.5753,41.6638,0.0],[-87.6065,41.7074,0.0],[-87.5985,41.7588,0.0],[-87.5912,41.7733,0.0],[-87.5716,41.7735,0.0],[-87.5435,41.7591,0.0],[-87.5418,41.7577,0.0],[-87.5303,41.7404,0.0],[-87.5299,41.7395,0.0],[-87.5247,41.7266,0.0],[-87.5179,41.7025,0.0],[-87.5316,41.6828,0.0],[-87.534,41.6809,0.0],[-87.5753,41.6638,0.0]]]};
    function mockBounds($q) {
        return function() {
            var dfd = $q.defer();
            dfd.resolve(graphBounds);
            return dfd.promise;
        };
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($httpBackend, $q, _Geocoder_, _MapControl_) {
        httpBackend = $httpBackend;
        Geocoder = _Geocoder_;
        MapControl = _MapControl_;
        MapControl.getGraphBounds = mockBounds($q);
        spyOn(MapControl, 'getGraphBounds').and.callThrough();
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

    it('should reject search with a message if nothing found', function() {
        httpBackend.whenGET(searchUrl).respond(searchResponse);
        Geocoder.search('Gotham').then(function () {}, function(error) {
            expect(error).toBeDefined();
        });
        httpBackend.flush();
    });
});
