(function () {
    'use strict';

    var osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/"">CC-BY-SA</a>';

    var config = {
        defaultUserSettings: {
            username: 'User',
            locations: [
                {'id':1,'text':'Pharmacy','img':'/images/icons/icon-shopping.svg','feature':{'geometry':{'x':-87.5529165205802,'y':41.728253865324746},'attributes':{'StAddr':'2924 E 92nd St','City':'Chicago','Postal':'60617'}},'address':{'text':'2924 E 92nd St, Chicago, Illinois, USA','magicKey':'GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZQBwaUN42HhcGC5waDMkuGTpaOgxF'},'type':'Cafe'},
                {'id':2,'text':'Bank','img':'/images/icons/icon-shopping.svg','feature':{'geometry':{'x':-87.55112379042981,'y':41.72724207676151},'attributes':{'StAddr':'9233 S Commercial Ave','City':'Chicago','Postal':'60617'}},'address':{'text':'9233 S Commercial Ave, Chicago, Illinois, USA','magicKey':'GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsNAQ14pDTyG1N44DSEUOh5t1g9QCP9KOgD7OoFF'},'type':'Other'},
                {'id':3,'text':'Groceries','img':'/images/icons/icon-shopping.svg','feature':{'geometry':{'x':-87.54839096926702,'y':41.72771969321036},'attributes':{'StAddr':'9229 S Baltimore Ave','City':'Chicago','Postal':'60617'}},'address':{'text':'9229 S Baltimore Ave, Chicago, Illinois, USA','magicKey':'GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsNaMo4pDTyG1N4dHgAG1gEnYMxuIhs0Dny0'},'type':'Shopping'},
                {'id':4,'text':'Dollar Store','img':'/images/icons/icon-shopping.svg','feature':{'geometry':{'x':-87.55120329769323,'y':41.7304811406932},'attributes':{'StAddr':'9045 S Commercial Ave','City':'Chicago','Postal':'60617'}},'address':{'text':'9045 S Commercial Ave, Chicago, Illinois, USA','magicKey':'GST7YMc0AM9UOsE3GY8tIS9GOghnYnwZIip_GQypG1cpOh9bZgKZQoc3YSyaagDIZhkZMsdGUo4pDTyG1N44DSEUOh5t1g9QCP9KOgD7OoFF'},'type':'Shopping'}
            ],
            preferences: {
                assistanceRequired: false,
                assistanceType: null,
                busy: 0,
                restFrequency: 0,
                speed: 1.1176,
                surfaceTypeComfort: 0.5
            }
        },
        bounds: {
            southWest: {
                lat: 41.7056,
                lng: -87.5943,
            },
            northEast: {
                lat: 41.762,
                lng: -87.5201
            }
        },
        baseLayers: {
            googleStreets: {
                name: 'Google Streets',
                type: 'google',
                layerType: 'ROADMAP'
            },
            // TODO: This needs to be removed once we start displaying Google Places data, but
            // for development it's good to have as a comparison since the Leaflet plugin enabling
            // Google layers may not always work perfectly.
            stamentonerlite: {
                name: 'Stamen Toner Lite',
                type: 'xyz',
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
                layerOptions: {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> ' +
                        '&mdash; ' + osmAttribution,
                    subdomains: ['a', 'b', 'c', 'd'],
                    minZoom: 3,
                    maxZoom: 20,
                    continuousWorld: true
                }
            }
        },
        center: {},
        nearbySearchRadius: 500,
        wheelchairSpeeds: {
            motorized: 1.56464, // ~3.5 mph
            manual: 0.6 // ~0.6 m/s (http://www.hindawi.com/journals/rerp/2012/753165/tab1/)
        },
        stubs: {
            geolocation: {
                latitude: 41.730399,
                longitude: -87.541500
            }
        },
        warningMinimumGrade: 5
    };

    angular.module('nih.config', [])
    .constant('Config', config);
})();
