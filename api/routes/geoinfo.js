const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/getAllLatLon', (req, res, next) => {
    res.status(200).json({
        message: 'Return an array with getAllLatLon'
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

/*     fetch('https://nominatim.openstreetmap.org/search?q=santa+rosa+5040+buenos+aires+caba+argentina&format=json&polygon=1&addressdetails=1')
    .then(resp => {
        console.log('resp: ' + resp);
        res.status(200).json({
            message: resp
        });
    })
    .catch(error => {
        console.log('error: ' , error);
    }); */
});

module.exports = router;