var bodyParser      = require('body-parser');
var express         = require('express');
var RequestProfiler = require('./request-profiler');
var app             = express();

// Allow reading of post data
app.use(bodyParser.json());

// Routes
app.use(RequestProfiler.profile());

// Routes
app.use('/', function(req, res, next) {
  res.send('hello');
});

// 404s
app.use(function(req, res) {
  res.status(404).json({
    message: '404: Page not found!'
  });
});

// Other errors
app.use(function(err, req, res) {
  if (err.message && err.status) {
    console.error(err.toString());
    if (err.stack) {
      console.erroa(err.stack);
    }
    res.status(err.status).json({message: err.message});
  } else {
    console.error(err.stack);
    res.status(500).json({message: 'Internal server error'});
  }
});


var server = app.listen(3000, function() {
  var host = 'localhost';
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
