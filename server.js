//require
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var records = require('./routes/records');
//globals


var port = 8080;
var config = {
  database: 'records',
  host: 'localhost',
  port: 5432,
  max: 30
}; // end config obj
var pool = new pg.Pool(config);


//uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/records', records);

//spin up server

app.listen(port, function() {
  console.log('server is up on port:', port);
});
//base url
app.get('/', function(req, res) {
  console.log('in base url');
  res.sendFile(path.resolve('views/index.html'));
}); //end base url

//get call
