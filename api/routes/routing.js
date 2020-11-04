const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/calculateBestRouteByDistance', (req, res, next) => {
    const allCoordinates = 'http://router.project-osrm.org/table/v1/driving/-58.420967,-34.596379;-58.44981619999999,-34.5704132?annotations=distance';
      
    request(allCoordinates, function (error, response, body) {
    console.log(Object.keys(JSON.parse(response.body)));
        if (!error && response.statusCode == 200) {
            res.status(200).json({
                message: JSON.parse(response.body).distances
            });
        }
    })
});
module.exports = router;