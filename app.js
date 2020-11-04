//Architecture from https://soshace.com/how-to-architect-a-node-js-project-from-ground-up/

const express = require('express');
const app = express();

//app.use(express.json()) // for parsing application/json

/*const getRoutes = {
    hostname: 'http://router.project-osrm.org/table/v1',
    port: 3000,
    path: '/driving',
    method: 'POST'
}*/

/*app.get('/validateAllLocations', (rep, res) => 
    res.send('Hello service, from my hearth!'
));
   
app.listen(3000, () => {
    console.log('route-service on port 3000');
});*/
const geoinfo = require('./api/routes/geoinfo');
const routing = require('./api/routes/routing');
/* app.use((req, res, next) => {
    res.status(200).json({
        message: 'Route server'
    });
}); */

app.use('/geoinfo', geoinfo);
app.use('/routing', routing)
module.exports = app;