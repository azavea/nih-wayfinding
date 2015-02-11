
'use strict';

describe('nih.routing: Directions', function () {

    // load the controller's module
    beforeEach(module('nih.routing'));
    beforeEach(module('nih.mapping'));

    var httpBackend;
    var rootScope;
    var TurnAmenities;
    var Directions;
    var ProfileService;
    var OTPMockResponse;
    var MockTransform;

    var requestUrl = /\/otp\/routers\/default\/plan\?.*/;

    beforeEach(module('nih.routing', function ($provide) {
        // Mock out TurnAmenities, we don't care about the request it makesj, only that
        //  it makes an attach request
        TurnAmenities = {
            attach: function () {},
            get: function () {
                return null;
            }
        };
        $provide.value('TurnAmenities', TurnAmenities);
    }));

    beforeEach(inject(function ($httpBackend, $rootScope, _Directions_, _TurnAmenities_, _ProfileService_,
               OTPResponseStub, RoutingResponseStub) {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        OTPMockResponse = OTPResponseStub;
        MockTransform = RoutingResponseStub;
        Directions = _Directions_;
        TurnAmenities = _TurnAmenities_;
        ProfileService = _ProfileService_;
    }));

    it('should ensure get returns an NIH response geojson object, properly transformed from OTP', function () {
        spyOn(TurnAmenities, 'attach');
        httpBackend.whenGET(requestUrl).respond(OTPMockResponse);
        Directions.get([10,10], [10,10]).then(function (geojson) {
            expect(geojson.type).toEqual('FeatureCollection');
            expect(geojson.features.directions).toEqual(MockTransform.features.directions);
            expect(TurnAmenities.attach).toHaveBeenCalledWith(geojson);

            // Test one of the feature's properties
            var featureZero = geojson.features[0];
            var otpFeatureZero = OTPMockResponse.plan.itineraries[0].legs[0].steps[0];
            expect(featureZero.geometry.type).toEqual('LineString');

            expect(featureZero.properties.directions.turn).toEqual(otpFeatureZero.relativeDirection);
            expect(featureZero.properties.directions.distanceMeters).toEqual(otpFeatureZero.distance);
            expect(featureZero.properties.flags.benches).toEqual(otpFeatureZero.benches);
            expect(featureZero.properties.flags.stayOn).toEqual(otpFeatureZero.stayOn);
        });
        httpBackend.flush();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should set OTP query parameters based on user preferences', function () {
        var user = ProfileService.createNewProfile();
        user.username = 'test';
        user.save();
        ProfileService.setCurrentUser(user.username);
        user.setPreference('restFrequency', 1);
        user.setPreference('assistanceRequired', true);
        user.setPreference('assistanceType', 'manual');
        user.save();
        httpBackend.whenGET(function(url) {
            expect(url).toMatch(/wheelchair=true/);
            expect(url).toMatch(/restingPlaces=true/);
            return true;
        }).respond(OTPMockResponse);
        Directions.get([10,10], [10,10]);
        httpBackend.flush();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should ensure Directions.get rejects the promise if bad lat/lon objects passed', function () {
        Directions.get([10,10], null).then(function () {
        }, function (error) {
            expect(error.msg).toEqual('Invalid destination parameter');
        });
        rootScope.$apply();

        Directions.get([10,10], [10]).then(function () {
        }, function (error) {
            expect(error.msg).toEqual('Invalid destination parameter');
        });
        rootScope.$apply();

        Directions.get([10], [10,10]).then(function () {
        }, function (error) {
            expect(error.msg).toEqual('Invalid origin parameter');
        });
        rootScope.$apply();

        Directions.get(null, [10,10]).then(function () {
        }, function (error) {
            expect(error.msg).toEqual('Invalid origin parameter');
        });
        rootScope.$apply();
    });

    it('should ensure isAudited returns true if all features are valid', function () {
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                geometry: {
                    type: 'LineString'
                },
                properties: {
                    lastModified: 123
                }
            }, {
                geometry: {
                    type: 'LineString'
                },
                properties: {
                    lastModified: 456
                }
            }]
        };
        expect(Directions.isAudited(geojson)).toEqual(true);
    });

    it('should ensure isAudited returns false if any last modified properties are false', function () {
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                geometry: {
                    type: 'LineString'
                },
                properties: {
                    lastModified: 123
                }
            }, {
                geometry: {
                    type: 'LineString'
                },
                properties: {}
            }]
        };
        expect(Directions.isAudited(geojson)).toEqual(false);
    });

    it('should ensure isAudited returns false if any last modified properties are zero', function () {
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                geometry: {
                    type: 'LineString'
                },
                properties: {
                    lastModified: 0
                }
            }]
        };
        expect(Directions.isAudited(geojson)).toEqual(false);
    });
});
