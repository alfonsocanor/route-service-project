//Architecture from https://soshace.com/how-to-architect-a-node-js-project-from-ground-up/
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routing = require('./api/routes/routing');

//app.use('/geoinfo', geoinfo);
app.use('/routing', routing);
app.get('*', function(req, res){
    res.send(
        'Currently TROUD only has /routing/calculateRouteByDistance service available'
    );
});
module.exports = app;