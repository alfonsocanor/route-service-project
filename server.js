const http = require('http');
const app = require('./app');
var { port } = require('./config');

const server = http.createServer(app);
 
port = process.env.PORT || 3111;
console.log(port);
server.listen(port);