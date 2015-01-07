(function () {
    'use strict';

    /* ngInject */
    function RoutingResponseStub () {
        return {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {
                "bench": true,
                "lastModified": 1357571029
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.63171672821045,
                    41.87683076934811
                  ],
                  [
                    -87.62420654296875,
                    41.87700651595926
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "lastModified": 1357571029
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.62414216995239,
                    41.87700651595926
                  ],
                  [
                    -87.62416362762451,
                    41.87826868196724
                  ],
                  [
                    -87.62253284454346,
                    41.87828465859237
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "lastModified": 1420124629
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.62244701385498,
                    41.878316611830684
                  ],
                  [
                    -87.61867046356201,
                    41.87833258844385
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "lastModified": 1420124629,
                "bench": true,
                "hazard": true,
                "bathroom": true
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.61867046356201,
                    41.87833258844385
                  ],
                  [
                    -87.61871337890624,
                    41.876415366346045
                  ],
                  [
                    -87.61940002441405,
                    41.87631950373135
                  ],
                  [
                    -87.61963605880737,
                    41.87598398344759
                  ],
                  [
                    -87.61965751647949,
                    41.875584552241726
                  ],
                  [
                    -87.6193356513977,
                    41.87529696022777
                  ],
                  [
                    -87.61892795562744,
                    41.8751691411395
                  ],
                  [
                    -87.61890649795532,
                    41.87464188469838
                  ],
                  [
                    -87.61929273605347,
                    41.87460992962275
                  ],
                  [
                    -87.61918544769287,
                    41.873267802019896
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "lastModified": 1357571029
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.61916399002075,
                    41.87321986836997
                  ],
                  [
                    -87.6205587387085,
                    41.8731879125834
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "hazard": true,
                "lastModified": 1393686229
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -87.62053728103638,
                    41.8731879125834
                  ],
                  [
                    -87.62053728103638,
                    41.86938505990959
                  ],
                  [
                    -87.62135267257689,
                    41.86933712334798
                  ]
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "bench"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.62856245040894,
                  41.87691065423128
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "bench"

              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.62439966201782,
                  41.877118354460166
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "hazard"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.61875629425049,
                  41.8778053581006
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "bathroom"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.61882066726685,
                  41.87691065423128
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "bench"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.61890649795532,
                  41.874881547256294
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "bathroom"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.61903524398802,
                  41.87467383975803
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "type": "hazard"
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -87.62051582336426,
                  41.86941701759735
                ]
              }
            }
          ]
        };
    }

    angular.module('nih.routing')
    .factory('RoutingResponseStub', RoutingResponseStub);

})();
