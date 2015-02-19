(function () {
    'use strict';

    var defaultUserSettings = {
            username: 'User',
            /* jshint ignore:start */
            locations: [
              {
                "id": 1,
                "text": "Pharmacy",
                "img": "/images/icons/icon-pharmacy.svg",
                "feature": {
                  "geometry": {
                    "x": -87.5529165205802,
                    "y": 41.728253865324746
                  },
                  "attributes": {
                    "StAddr": "2924 E 92nd St",
                    "City": "Chicago",
                    "Postal": "60617"
                  }
                },
                "address": {
                  "text": "2924 E 92nd St, Chicago, Illinois, USA",
                  "magicKey": "GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZQBwaUN42HhcGC5waDMkuGTpaOgxF"
                },
                "type": "Pharmacy"
              },
              {
                "id": 2,
                "text": "Bank",
                "img": "/images/icons/icon-bank.svg",
                "feature": {
                  "geometry": {
                    "x": -87.55112379042981,
                    "y": 41.72724207676151
                  },
                  "attributes": {
                    "StAddr": "9233 S Commercial Ave",
                    "City": "Chicago",
                    "Postal": "60617"
                  }
                },
                "address": {
                  "text": "9233 S Commercial Ave, Chicago, Illinois, USA",
                  "magicKey": "GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsNAQ14pDTyG1N44DSEUOh5t1g9QCP9KOgD7OoFF"
                },
                "type": "Bank"
              },
              {
                "id": 3,
                "text": "Groceries",
                "img": "/images/icons/icon-butcher.svg",
                "feature": {
                  "geometry": {
                    "x": -87.54839096926702,
                    "y": 41.72771969321036
                  },
                  "attributes": {
                    "StAddr": "9229 S Baltimore Ave",
                    "City": "Chicago",
                    "Postal": "60617"
                  }
                },
                "address": {
                  "text": "9229 S Baltimore Ave, Chicago, Illinois, USA",
                  "magicKey": "GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsNaMo4pDTyG1N4dHgAG1gEnYMxuIhs0Dny0"
                },
                "type": "Grocery"
              },
              {
                "id": 4,
                "text": "Dollar Store",
                "img": "/images/icons/icon-shopping.svg",
                "feature": {
                  "geometry": {
                    "x": -87.55120329769323,
                    "y": 41.7304811406932
                  },
                  "attributes": {
                    "StAddr": "9045 S Commercial Ave",
                    "City": "Chicago",
                    "Postal": "60617"
                  }
                },
                "address": {
                  "text": "9045 S Commercial Ave, Chicago, Illinois, USA",
                  "magicKey": "GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsdGUo4pDTyG1N44DSEUOh5t1g9QCP9KOgD7OoFF"
                },
                "type": "Shopping"
              },
              {
                "id": 5,
                "text": "High School",
                "img": "/images/icons/icon-school.svg",
                "feature": {
                  "geometry": {
                    "x": -87.55796910199967,
                    "y": 41.73365761100047
                  },
                  "attributes": {
                    "StAddr": "2710 E 89th St",
                    "City": "Chicago",
                    "Postal": ""
                  }
                },
                "address": {
                  "text": "James H Bowen High School, 2710 E 89th St, Chicago, Illinois",
                  "magicKey": "GST7YMc0AM9UOsE9HhFtGTyVGST7YMc0AM9UOsE9DbTVHgA9HhB0Zcp0OhNtGMytaikZQskHMsoJUBktIS9GOghnYnwZGPT-CZc0YiD7DsKJCZyAOh5-Dn47Z5EVDTh0DF4C1oFF"
                },
                "type": "School"
              },
              {
                "id": 6,
                "text": "3213 E 93rd St",
                "img": "/images/icons/icon-house.svg",
                "feature": {
                  "geometry": {
                    "x": -87.54644160959185,
                    "y": 41.726433672577
                  },
                  "attributes": {
                    "StAddr": "3213 E 93rd St",
                    "City": "Chicago",
                    "Postal": "60617"
                  }
                },
                "address": {
                  "text": "3213 E 93rd St, Chicago, Illinois, USA",
                  "magicKey": "GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZQDNJQ142C5wAYMkuGTkQCPcC1gcvOSSQCPWQDbWMDSWABN43GY8F"
                },
                "type": "House"
              }
            ],
            /* jshint ignore:end */
            preferences: {
                assistanceRequired: false,
                assistanceType: null,
                busy: 0,
                restFrequency: 0,
                speed: 1.1176,
                surfaceTypeComfort: 0.5
            }
        };

    angular.module('nih.profiles')
    .constant('DefaultUser', defaultUserSettings);
})();
