var http = require('http')
var mongoose = require('mongoose');
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World and Pete\n');
}).listen(port);