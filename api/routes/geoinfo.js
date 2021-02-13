const express = require('express');
const request = require('request');
const mocks = require('./mockResponses')
let xmlParser = require('xml2json');
const requestPromise = require('request-promise');
const parseString = require('xml2js').parseString;
const router = express.Router();

router.get('/getAllLatLon', (req, res, next) => {
    const AddresArrayMock = mocks.routeInformation();
    console.log('routeInformation: ' , AddresArrayMock);
    const AddressArray = [
        { clientId: '1', clientName: 'James Jhonson', address: 'Arevalo 2024 C1414 CABA'},
        { clientId: '2', clientName: 'Alice Connor', address: 'Thames 1101 C1414 DCW Buenos Aires'}
    ];

    let latlgnArray = [];

    for(addressIndex in AddressArray){
        let address =
            'https://maps.googleapis.com/maps/api/geocode/xml?address=' + 
            AddressArray[addressIndex].address.replaceAll(' ', '+') + 
            '&key=AIzaSyD-sJExtQv3bQ8NQnhYA2BTo3OZ3lU57ow'; 
        latlgnArray.push(requestPromise({uri: address, encoding: 'utf-8'}));
    }
    
    Promise.all(latlgnArray).then(results => {
        console.log(results);        
        var testArray = [];
        for(index in results){
            parseString(results[index],function (err, result) {
                testArray.push({
                    id: AddressArray[index].clientId,
                    clientName: AddressArray[index].clientName,
                    lat: result.GeocodeResponse.result[0].geometry[0].location[0].lat[0],
                    lng: result.GeocodeResponse.result[0].geometry[0].location[0].lng[0]
                });
            })
        }
        res.send(testArray);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

router.get('/getSingleLanLon', (req, res, next) => {        
    const address = 
        'https://maps.googleapis.com/maps/api/geocode/xml?address=santa+rosa+5040+buenos+aires+caba+argentina,+CA&key=AIzaSyD-sJExtQv3bQ8NQnhYA2BTo3OZ3lU57ow';        
    
    request(address, function (error, response, body) {
    console.log(response);
    
        if (!error && response.statusCode == 200) {
                parseString(response.body,function (err, result) {
                    console.dir(result);
                    res.status(200).json({
                        lat: result.GeocodeResponse.result[0].geometry[0].location[0].lat[0],
                        lng: result.GeocodeResponse.result[0].geometry[0].location[0].lng[0]
                    });
                });
        }
    })
});

module.exports = router;