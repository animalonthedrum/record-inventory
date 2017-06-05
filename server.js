//require
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
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

app.get('/records', function(req, res) {
  console.log('get hit to /records');
  // connect to db
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error conencting to db');
      done();
      res.send('not working');
    } // end Error
    else {
      console.log('connected to db');
      var allRecords = [];
      // create our query string
      // tell db to run query
      // hold results in variable
      var results = connection.query("SELECT * from record_inventory ORDER BY artist");
      results.on('row', function(row) {
        // loop through result set and push each row into an array
        allRecords.push(row);
      }); // end
      results.on('end', function() {
        // close connection
        done();
        // send back data
        res.send(allRecords);
      });
    } // end no error
  }); // end pool connect
}); // end /todo get

app.post('/records', function(req, res) {
  console.log('post hit to /records:', req.body);
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log(err);
      done();
      res.send(400);
    } // end error
    else {
      console.log('connected to db');
      connection.query("INSERT INTO record_inventory ( artist, album, rating) values ( $1, $2, $3 )", [req.body.artist, req.body.album, req.body.rating]);
      done();
      res.send(200);
    } // end no error
  }); // end pool connect
}); // end /todo post

app.delete('/records/:id', function(req, res) {

  var id = req.params.id;

  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error');
      done();
      res.sendStatus(500);
    } else {
      connection.query("DELETE FROM record_inventory WHERE id = " + id);
      done();
      res.sendStatus(200);
    } //end else
  }); //end pool
}); // end delete

app.put('/records/:id', function(req, res) {
  var id = req.params.id;
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log('error');
      done();
      res.sendStatus(500);
    } else {
      connection.query("UPDATE record_inventory SET rating=" + req.body.rating + "WHERE id = " + id);
      done();
      res.sendStatus(200);
    } // end else
  }); //end pool
}); // end app.put
