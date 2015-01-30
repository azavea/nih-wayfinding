
'use strict';

describe('nih.routing: Directions', function () {

    // load the controller's module
    beforeEach(module('nih.routing'));

    var httpBackend;
    var rootScope;
    var TurnAmenities;
    var Directions;
    var ProfileService;

    var requestUrl = /\/otp\/routers\/default\/plan\?.*/;

    var getResponse = {
      'requestParameters': {
        'showIntermediateStops': 'false',
        'time': '11:59',
        'arriveBy': 'false',
        'wheelchair': 'true',
        'fromPlace': '41.73743967711266,-87.55356788635254',
        'toPlace': '41.72866461875987,-87.56206512451172',
        'date': '01-05-2015',
        'mode': 'WALK',
        'walkTimeMins': '0'
      },
      'plan': {
        'date': 1420459140000,
        'from': {
          'name': 'East 87th Street',
          'lon': -87.5535658763189,
          'lat': 41.73735561859548,
          'orig': ''
        },
        'to': {
          'name': 'South Kingston Avenue',
          'lon': -87.56212183678379,
          'lat': 41.728663364422594,
          'orig': ''
        },
        'itineraries': [
          {
            'duration': 1249,
            'startTime': 1420459140000,
            'endTime': 1420460389000,
            'walkTime': 1249,
            'transitTime': 0,
            'waitingTime': 0,
            'walkDistance': 1616.5698045057345,
            'benches': 0,
            'toilets': 0,
            'restingPlaces': false,
            'unevenSurfaces': false,
            'aesthetic': false,
            'walkLimitExceeded': false,
            'elevationLost': 0,
            'elevationGained': 0,
            'transfers': 0,
            'fare': {
              'fare': {}
            },
            'legs': [
              {
                'startTime': 1420459140000,
                'endTime': 1420460389000,
                'departureDelay': 0,
                'arrivalDelay': 0,
                'realTime': false,
                'distance': 1616.398,
                'pathway': false,
                'mode': 'WALK',
                'route': '',
                'agencyTimeZoneOffset': 0,
                'interlineWithPreviousLeg': false,
                'benches': 0,
                'toilets': 0,
                'restingPlaces': false,
                'unevenSurfaces': false,
                'aesthetic': false,
                'from': {
                  'name': 'East 87th Street',
                  'lon': -87.5535658763189,
                  'lat': 41.73735561859548,
                  'departure': 1420459140000,
                  'orig': ''
                },
                'to': {
                  'name': 'South Kingston Avenue',
                  'lon': -87.56212183678379,
                  'lat': 41.728663364422594,
                  'arrival': 1420460389000,
                  'orig': ''
                },
                'legGeometry': {
                  'points': 'myv}FxhkuO?|@@bA@fC?d@@dB@fC?D?tB?R@fB?Z@vA?r@@dA?`A@x@?pAlJIvAAxDEvAAFJfA`Bn@_A\\d@vArBDDV^tAnBFR?^BtBzGInAA~FI',
                  'length': 36
                },
                'rentedBike': false,
                'duration': 1249,
                'transitLeg': false,
                'steps': [
                  {
                    'distance': 512.299,
                    'relativeDirection': 'DEPART',
                    'streetName': 'East 87th Street',
                    'absoluteDirection': 'WEST',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5535658763189,
                    'lat': 41.73735561859548,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': 'myv}FxhkuO?|@@bA@fC?d@@dB@fC?D?tB?R@fB?Z@vA?r@@dA?`A@x@?pA',
                      'length': 18
                    },
                    'elevation': []
                  },
                  {
                    'distance': 404.267,
                    'relativeDirection': 'LEFT',
                    'streetName': 'South Saginaw Avenue',
                    'absoluteDirection': 'SOUTH',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5597392,
                    'lat': 41.7372736,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': '}xv}FjoluOlJIvAAxDEvAA',
                      'length': 5
                    },
                    'elevation': []
                  },
                  {
                    'distance': 63.64,
                    'relativeDirection': 'RIGHT',
                    'streetName': 'South Saginaw Avenue',
                    'absoluteDirection': 'SOUTHWEST',
                    'stayOn': true,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5596398,
                    'lat': 41.7336387,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': 'ebv}FvnluOFJfA`B',
                      'length': 3
                    },
                    'elevation': []
                  },
                  {
                    'distance': 37.747,
                    'relativeDirection': 'LEFT',
                    'streetName': 'South South Chicago Avenue',
                    'absoluteDirection': 'SOUTHEAST',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5601861,
                    'lat': 41.733237,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': 'u_v}FdrluOn@_A',
                      'length': 2
                    },
                    'elevation': []
                  },
                  {
                    'distance': 181.322,
                    'relativeDirection': 'RIGHT',
                    'streetName': 'South Colfax Avenue',
                    'absoluteDirection': 'SOUTHWEST',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5598664,
                    'lat': 41.7329955,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': 'izu}FduluOV^tAnB',
                      'length': 3
                    },
                    'elevation': []
                  },
                  {
                    'distance': 71.826,
                    'relativeDirection': 'SLIGHTLY_RIGHT',
                    'streetName': 'East 90th Street',
                    'absoluteDirection': 'WEST',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5613845,
                    'lat': 41.7318226,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': '{vu}FtyluOFR?^BtB',
                      'length': 4
                    },
                    'elevation': []
                  },
                  {
                    'distance': 345.297,
                    'relativeDirection': 'LEFT',
                    'streetName': 'South Kingston Avenue',
                    'absoluteDirection': 'SOUTH',
                    'stayOn': false,
                    'area': false,
                    'bogusName': false,
                    'lon': -87.5622378,
                    'lat': 41.7317675,
                    'benches': 0,
                    'toilets': 0,
                    'rest': '',
                    'unevenSurfaces': false,
                    'aesthetics': false,
                    'stepGeometry': {
                      'points': 'ovu}F~~luOzGInAA~FI',
                      'length': 4
                    },
                    'elevation': []
                  }
                ]
              }
            ],
            'tooSloped': false
          }
        ]
      },
      'debugOutput': {
        'precalculationTime': 0,
        'pathCalculationTime': 10,
        'pathTimes': [
          10
        ],
        'renderingTime': 3,
        'totalTime': 13,
        'timedOut': false
      }
    };
    beforeEach(module('nih.routing', function ($provide) {
        // Mock out TurnAmenities, we don't care about the request it makes, only that
        //  it makes an attach request
        TurnAmenities = {
            attach: function () {},
            get: function () {
                return null;
            }
        };
        $provide.value('TurnAmenities', TurnAmenities);
    }));

    beforeEach(inject(function ($httpBackend, $rootScope, _Directions_, _TurnAmenities_, _ProfileService_) {
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        Directions = _Directions_;
        TurnAmenities = _TurnAmenities_;
        ProfileService = _ProfileService_;
    }));

    it('should ensure get returns an NIH response geojson object, properly transformed from OTP', function () {
        spyOn(TurnAmenities, 'attach');
        httpBackend.whenGET(requestUrl).respond(getResponse);
        Directions.get([10,10], [10,10]).then(function (geojson) {
            expect(geojson.type).toEqual('FeatureCollection');
            expect(geojson.features.length).toEqual(7);
            expect(TurnAmenities.attach).toHaveBeenCalledWith(geojson);

            // Test one of the feature's properties
            var featureZero = geojson.features[0];
            var otpFeatureZero = getResponse.plan.itineraries[0].legs[0].steps[0];
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
        var user = ProfileService.createBlankProfile();
        user.username = 'test';
        user.save();
        ProfileService.setCurrentUser(user.username);
        user.setPreference('restFrequency', 1);
        user.setPreference('assistanceRequired', true);
        user.setPreference('assistanceType', 'manual');
        user.save();
        var params = Directions.getRequestParams();
        expect(params.wheelchair).toEqual(true);
        expect(params.walkSpeed).toBeLessThan(1);
        expect(params.restingPlaces, true);
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
});
