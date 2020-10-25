const express = require('express');
const app = express();

const getRoutes = {
    hostname: 'localhost',
    port: 3000,
    path: '/getRoute',
    method: 'GET'
}

app.get('/', (rep, res) => res.send('Hello service, from my hearth!'));

app.listen(3000, () => {
    console.log('route-service on port 3000');
});