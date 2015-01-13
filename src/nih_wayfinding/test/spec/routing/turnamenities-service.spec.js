'use strict';

describe('nih.routing: TurnAmenities', function () {



    // load the controller's module
    beforeEach(module('nih.routing'));

    var TurnAmenities;
    var httpBackend;
    var x = -75.179189;  // intersection of 22nd and Catherine in Philadelphia
    var y = 39.942425;

    var expectedName = 'Ultimo Coffee';

    var reqUrl = 'http://overpass-api.de/api/interpreter?data=%5Bout:json%5D;node(around:75,' + y + ',' + x + ')%5Bamenity%5D%5Bname%5D%5Bamenity!%3D%22bicycle_rental%22%5D;out;';

    var getResponse = {
        'version': 0.6,
        'generator': 'Overpass API',
        'osm3s': {
            'timestamp_osm_base': '2015-01-12T21:44:02Z',
            'copyright': 'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.'
        },
        'elements': [
            {
                'type': 'node',
                'id': 2654389780,
                'lat': 39.9425126,
                'lon': -75.1790358,
                'tags': {
                    'addr:city': 'Philadelphia',
                    'addr:housenumber': '2149',
                    'addr:postcode': '19146',
                    'addr:street': 'Catharine Street',
                    'amenity': 'cafe',
                    'cuisine': 'coffee_shop',
                    'name': 'Ultimo Coffee',
                    'website': 'http://ultimocoffee.com/'
                }
            }
        ]
    };

    var geojson = {
        'features': [
            {
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [x, y],
                        [x + 1, y + 1]
                    ]
                },
                'properties': {}
            }
        ]
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($httpBackend, _TurnAmenities_) {
        httpBackend = $httpBackend;
        TurnAmenities = _TurnAmenities_;
    }));

    it('should ensure get returns an expected POI', function () {
        httpBackend.whenGET(reqUrl).respond(getResponse);
        TurnAmenities.get(x, y).then(function (amenity) {
            expect(amenity.tags.name).toEqual(expectedName);
        });
        httpBackend.flush();
    });

    it('should ensure attach attaches amenities to the GeoJSON and returns amenities', function() {
        httpBackend.whenGET(reqUrl).respond(getResponse);
        TurnAmenities.attach(geojson).then(function (amenities) {
            expect(geojson.features[0].properties.turnamenity.tags.name)
                .toEqual(expectedName);
            expect(amenities[0].tags.name).toEqual(expectedName);
        });
        httpBackend.flush();
    });
});
