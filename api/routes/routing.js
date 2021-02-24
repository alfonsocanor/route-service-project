const express = require('express');
const request = require('request');
var jsonValidator = require('jsonschema').Validator;
var bodyParser = require('body-parser');
const { route } = require('./geoinfo');
const router = express.Router();

var validator = new jsonValidator();
validator.addSchema(locationsSchema, '/Locations');

router.get('/calculateBestRouteByDistance', (req, res, next) => {
    var locations = 
    [
        {accountId: 'DDDD', lat: -34.5610818, lng: -58.4599501 },
        {accountId: 'BBBB', lat: -34.5779381, lng: -58.4344584 },
        {accountId: 'AAAA', lat: -34.5831321, lng: -58.4284932 },
        {accountId: 'CCCC', lat: -34.5714363, lng: -58.4464747 }
    ];

    try {
        validator.validate(locations, locationsSchema, {
            throwError: true
        });
    } catch (error) {
        res.status(401).end('Invalid body format: ' + error.message);
        return;
    }
      
    var allCoordinates = 'http://router.project-osrm.org/table/v1/driving/';
    
    for(locationIndex in locations){
        allCoordinates = allCoordinates + locations[locationIndex].lng + ',' + locations[locationIndex].lat + ';';
    }
    allCoordinates = allCoordinates.slice(0, -1) + '?annotations=distance';

    console.log('allCoordinates: ' + allCoordinates);
    request(allCoordinates, function (error, response, body) {
        if(response.statusCode == 503){
            res.status(503).json({
                error: '503 OSRM Service Unavailable: Apache/2.4.38 (Debian) Server at router.project-osrm.org Port 80'
            });  
            return; 
        }

        console.log(Object.keys(JSON.parse(response.body)));
        if (!error && response.statusCode == 200) {
            var distances = JSON.parse(response.body).distances;

            for(distanceIndex in distances){
                locations[distanceIndex].distancesBetween = distances[distanceIndex];
            }

            var route = troudAlgorithmPoweredByOSRM(locations);

            res.status(200).json({
                route: route
            });
        }
    })
});

router.post('/calculateRouteByDistance', (req, res, next) => {
    var locations = req.body;

    if(res.statusCode == 503){
        res.status(503).json({
            error: '503 OSRM Service Unavailable: Apache/2.4.38 (Debian) Server at router.project-osrm.org Port 80'
        });  
        return; 
    }

    try {
        validator.validate(locations, locationsSchema, {
            throwError: true
        });
    } catch (error) {
        res.status(401).end('Invalid body format: ' + error.message);
        return;
    }

    //Endpoint form
    //'http://router.project-osrm.org/table/v1/driving/-58.4284932,-34.5831321;-58.4344584,-34.5779381;-58.4464747,-34.5714363;-58.4599501,-34.5610818;?annotations=distance';
    var allCoordinates = 'http://router.project-osrm.org/table/v1/driving/';

    for(locationIndex in locations){
        allCoordinates = allCoordinates + locations[locationIndex].lng + ',' + locations[locationIndex].lat + ';';
    }
    allCoordinates = allCoordinates.slice(0, -1) + '?annotations=distance';

    request(allCoordinates, function (error, response, body) {
        console.log(Object.keys(JSON.parse(response.body)));
        if (!error && response.statusCode == 200) {
            var distances = JSON.parse(response.body).distances;
            for(distanceIndex in distances){
                locations[distanceIndex].distancesBetween = distances[distanceIndex];
            }

            var routes = troudAlgorithmPoweredByOSRM(locations);

            res.status(200).json({
                routes: routes
            });
        }
    })
});

//TROUD Algorithm Powered by Open Source Routing Machine (OSRM)
function troudAlgorithmPoweredByOSRM(locations){
    //console.log(locations);

    var totalLocations = locations.length;
    var indexUsed = [];
    var route = [];
    var nextLocation = 0;

    if(totalLocations === 1){
        route.add(locations);
        return route;
    }

    for(var i=0;i<totalLocations;i++){

        if(i === (totalLocations - 1)){ //If last location
            route.push(locations[nextLocation]);
            indexUsed.push(nextLocation);
            break;
        }

        //The first it's the Warehouse
        if(i !== 0){
            route.push(locations[nextLocation]);
        }
    
        indexUsed.push(nextLocation);

        //console.log('indexUsed: ' + indexUsed);
        distance2NextLocation = locations[nextLocation].distancesBetween.reduce(function (validNextLocationSoFar, location2Compare){
                //console.log('validNextLocationSoFar: ' + validNextLocationSoFar);
                //console.log('location2Compare: ' + location2Compare);   

                console.log('Condigition IndexUsed: ' + indexUsed.includes(locations[nextLocation].distancesBetween.indexOf(validNextLocationSoFar)));
                if(indexUsed.includes(locations[nextLocation].distancesBetween.indexOf(validNextLocationSoFar))){
                    return location2Compare;
                }

                if(validNextLocationSoFar === 0 && location2Compare !== 0){
                    return location2Compare;
                }                 
                if(validNextLocationSoFar != 0 && validNextLocationSoFar < location2Compare){
                    return validNextLocationSoFar;
                }
                if(indexUsed.includes(locations[nextLocation].distancesBetween.indexOf(location2Compare))){
                    return validNextLocationSoFar;
                }

                return location2Compare; 
        });
        console.log('nextLocationByIndex: ' + distance2NextLocation);
        nextLocation = locations[nextLocation].distancesBetween.indexOf(distance2NextLocation);
        console.log('Final nextLocation: ' + nextLocation)
    }
    console.log(route);
    return route;
}

var locationsSchema = {
    type: 'array',
    "items": {
        properties: {
            lat: {
                type: 'number'
            },
            lng: {
                type: 'number'
            }
        },
        required: ['lat', 'lng']
    }
};

module.exports = router;