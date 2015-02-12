(function () {
    'use strict';

    /* ngInject */
    function OTPResponseStub () {
    /* jshint ignore:start */
        return {
          "requestParameters": {
            "showIntermediateStops": "false",
            "time": "10:7",
            "arriveBy": "false",
            "surfaceComfort": "0.5",
            "wheelchair": "false",
            "fromPlace": "41.7301127,-87.5484962",
            "toPlace": "41.72771969321036,-87.54839096926702",
            "date": "02-03-2015",
            "walkSpeed": "1.1176",
            "mode": "WALK",
            "walkTimeMins": "0"
          },
          "plan": {
            "date": 1422958020000,
            "from": {
              "name": "corner of South Baltimore Avenue and East 91st Street",
              "lon": -87.5484962,
              "lat": 41.7301127,
              "orig": ""
            },
            "to": {
              "name": "corner of South Baltimore Avenue and alley",
              "lon": -87.54839096926702,
              "lat": 41.72771969321036,
              "orig": ""
            },
            "itineraries": [
              {
                "duration": 235,
                "startTime": 1422958020000,
                "endTime": 1422958255000,
                "walkTime": 235,
                "transitTime": 0,
                "waitingTime": 0,
                "walkDistance": 259.899,
                "benches": 0,
                "toilets": 0,
                "restingPlaces": true,
                "crossSlope": true,
                "aesthetic": true,
                "walkLimitExceeded": false,
                "elevationLost": 0.30000000000001137,
                "elevationGained": 0.5,
                "transfers": 0,
                "fare": {
                  "fare": {}
                },
                "legs": [
                  {
                    "startTime": 1422958020000,
                    "endTime": 1422958255000,
                    "departureDelay": 0,
                    "arrivalDelay": 0,
                    "realTime": false,
                    "distance": 259.899,
                    "pathway": false,
                    "mode": "WALK",
                    "route": "",
                    "agencyTimeZoneOffset": 0,
                    "interlineWithPreviousLeg": false,
                    "benches": 0,
                    "toilets": 0,
                    "from": {
                      "name": "corner of South Baltimore Avenue and East 91st Street",
                      "lon": -87.5484962,
                      "lat": 41.7301127,
                      "departure": 1422958020000,
                      "orig": ""
                    },
                    "to": {
                      "name": "corner of South Baltimore Avenue and alley",
                      "lon": -87.54839096926702,
                      "lat": 41.72771969321036,
                      "arrival": 1422958255000,
                      "orig": ""
                    },
                    "legGeometry": {
                      "points": "elu}FbijuOhGC`BCfBA",
                      "length": 4
                    },
                    "rentedBike": false,
                    "duration": 235,
                    "transitLeg": false,
                    "steps": [
                      {
                        "distance": 259.899,
                        "relativeDirection": "DEPART",
                        "streetName": "South Baltimore Avenue",
                        "absoluteDirection": "SOUTH",
                        "stayOn": false,
                        "area": false,
                        "bogusName": false,
                        "lon": -87.5484962,
                        "lat": 41.7301127,
                        "benches": 0,
                        "toilets": 0,
                        "rest": "Low Wall",
                        "surface": "Concrete",
                        "hazards": "High",
                        "crossSlope": true,
                        "aesthetics": true,
                        "maxSlope": 0.015681265,
                        "stepGeometry": {
                          "points": "elu}FbijuOhGC`BCfBA",
                          "length": 4
                        },
                        "lastAudited": 1423667251610,
                        "elevation": [
                          {
                            "first": 0,
                            "second": 179.69
                          },
                          {
                            "first": 10,
                            "second": 179.69
                          },
                          {
                            "first": 20,
                            "second": 179.69
                          },
                          {
                            "first": 30,
                            "second": 179.69
                          },
                          {
                            "first": 40,
                            "second": 179.69
                          },
                          {
                            "first": 50,
                            "second": 179.75
                          },
                          {
                            "first": 60,
                            "second": 179.79
                          },
                          {
                            "first": 70,
                            "second": 179.8
                          },
                          {
                            "first": 80,
                            "second": 179.8
                          },
                          {
                            "first": 90,
                            "second": 179.85
                          },
                          {
                            "first": 100,
                            "second": 179.88
                          },
                          {
                            "first": 110,
                            "second": 179.88
                          },
                          {
                            "first": 120,
                            "second": 179.9
                          },
                          {
                            "first": 130,
                            "second": 180.02
                          },
                          {
                            "first": 140,
                            "second": 180.18
                          },
                          {
                            "first": 147.25,
                            "second": 180.18
                          },
                          {
                            "first": 294.498,
                            "second": 180.18
                          },
                          {
                            "first": 304.498,
                            "second": 180.18
                          },
                          {
                            "first": 314.498,
                            "second": 180.18
                          },
                          {
                            "first": 324.498,
                            "second": 180.06
                          },
                          {
                            "first": 334.498,
                            "second": 180.05
                          },
                          {
                            "first": 344.498,
                            "second": 179.99
                          },
                          {
                            "first": 349.638,
                            "second": 179.99
                          },
                          {
                            "first": 349.637,
                            "second": 179.99
                          },
                          {
                            "first": 359.637,
                            "second": 179.99
                          },
                          {
                            "first": 369.637,
                            "second": 179.99
                          },
                          {
                            "first": 379.637,
                            "second": 180
                          },
                          {
                            "first": 389.637,
                            "second": 179.99
                          },
                          {
                            "first": 399.637,
                            "second": 179.94
                          },
                          {
                            "first": 407.147,
                            "second": 179.89
                          }
                        ]
                      }
                    ]
                  }
                ],
                "tooSloped": false
              }
            ]
          },
          "debugOutput": {
            "precalculationTime": 0,
            "pathCalculationTime": 5,
            "pathTimes": [
              5
            ],
            "renderingTime": 2,
            "totalTime": 7,
            "timedOut": false
          }
        };
        /* jshint ignore:end */
    }

    angular.module('nih.routing')
    .factory('OTPResponseStub', OTPResponseStub);

})();
