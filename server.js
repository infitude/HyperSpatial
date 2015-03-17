//var http = require('http')
//var mongoose = require('mongoose');
var port = process.env.PORT || 1337;
//
//http.createServer(function(req, res) {
//
//  var db = mongoose.createConnection('mongodb://user1:user1@ds041177.mongolab.com:41177/lpdb');
// 
// res.writeHead(200, { 'Content-Type': 'text/plain' });
// 
//  db.on('error', console.error.bind(console, 'connection error:'));
//  db.once('open', console.error.bind(console, 'db connected:'));
//
//  res.end('Hello World and Pete\n');
//
//}).listen(port);

var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var jsonld = require('jsonld');
 
var app = express();
 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
 
//mongoose.connect('mongodb://localhost/test');
 //var db = mongoose.connection;
mongoose.connect('mongodb://user1:user1@ds041177.mongolab.com:41177/lpdb');
var db = mongoose.connection;

//var db = mongoose.createConnection('mongodb://user1:user1@ds041177.mongolab.com:41177/lpdb');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.error.bind(console, 'db connected:'));
 
//Create Our Models
var citySchema = mongoose.Schema({
            id: Number, 
            geometry : {type : { type: String },coordinates : [ Number , Number ]},
            properties : {name: String, status: String, Population: Number}
     });
 
citySchema.methods.greet = function() { console.log('Hello, ' + this.properties); };
 
var City = mongoose.model('City', citySchema);
 
 
//Create the server
var server = app.listen(port, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log('Example app listening at http://%s:%s', host, port);
 
})


app.get('/test/jsonld', function (req,res) {

    console.log('test jsonld');

var doc = {
  "http://schema.org/name": "Manu Sporny",
  "http://schema.org/url": {"@id": "http://manu.sporny.org/"},
  "http://schema.org/image": {"@id": "http://manu.sporny.org/images/manu.png"}
};
var context = {
  "name": "http://schema.org/name",
  "homepage": {"@id": "http://schema.org/url", "@type": "@id"},
  "image": {"@id": "http://schema.org/image", "@type": "@id"}
};


// compact a document according to a particular context
// see: http://json-ld.org/spec/latest/json-ld/#compacted-document-form
jsonld.compact(doc, context, function(err, compacted) {
  console.log(JSON.stringify(compacted, null, 2));
  /* Output:
  {
    "@context": {...},
    "name": "Manu Sporny",
    "homepage": "http://manu.sporny.org/",
    "image": "http://manu.sporny.org/images/manu.png"
  }
  */
});

    
    res.send('ok');
});
 
///http://<>Server:3000/<DB>/<Collection>/identify?geometryType=esriGeometryPoint&geometry=-120,40&tolerance=10
app.get('/test/City/identify', function (req, res) {
 
                console.log(req.query.geometry);
 
                var geom = req.query.geometry;
 
                var long = req.query.geometry.split(",")[0] ;
                var lat = req.query.geometry.split(",")[1];
 
                var tolerance = req.query.tolerance;
 
 
                console.log('1');
                var query = City.where('geometry').near( { center : [long,lat], spherical: true, maxDistance: tolerance } );
 
               
                console.log('2');
                //var query  = City.where({ id: 1 });
 
                query.findOne(function (err, city) {
                                if (err) return console.error(err);
                                //console.log(cities);
                                console.log('3')
                                console.log(city);
                                res.send(city);  
                                //res.end();       
                });
});
 
 
 
 
//http://<>Server:3000/<DB>/<Collection>/_id
app.get('/test/City/:id', function (req, res) {
 
                City.findById(req.params.id, function (err, city) {
 
                                if (err) return console.error(err);
               
                                res.json(city);   
 
                });
});
 
 
 
//Use Put to Update
app.put('/test/City', function (req, res) {
 
 	console.log("PUT");

                //Always store coordinates in longitude, latitude order.
    var wellington = new City({id: 1,  geometry: {type: "Point", coordinates : [ 174 , -42 ]}, properties : {name: "Wellington", status: "Cool", Population: 100}});
 
 	console.log("Attempting save...");

                wellington.save(function (err, wellington) {
                                                if (err) return console.error(err);
                                                                //fluffy.speak();
                                    //res.send(wellington.greet());
                                    //If Created then send
                                    res.sendStatus(201);
                                    //If Updated Send 200 OK
                });
});
 
//Post to Create
app.post('/test/City', function (req, res) {
 
                //Always store coordinates in longitude, latitude order.
 
                console.log(req.body);
    //res.json(req.body);
 
                //console.log(req.content);
 
    var city = new City(req.body);
 
                city.save(function (err, city) {
                                                if (err) return console.error(err);
                                    //fluffy.speak();
                                    //res.send(wellington.greet());
                                    //If Created then send
                                    res.location('/test/City/' + city._id);
                                    res.sendStatus(201);
                                    //If Updated Send 200 OK
                });
 
});
 
//Use this for updates
app.patch('/test/City', function (req, res) {
                console.log('patched');
                res.send('patched');
});
 
app.delete('/test/City', function (req, res) {
               
                console.log('deleted');
                City.remove({ }, function (err) {
                                if (err) {
                                                return console.error(err);
                                                res.sendStatus(500);
 
                                } else{
 
                                                res.sendStatus(200);
                                }
                                                                //fluffy.speak();
                                    //res.send(wellington.greet());
                                    //If Created then send
                               
                });
});
 