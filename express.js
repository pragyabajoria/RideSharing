// Initialize express and create an app instance.
var express = require('express');
var app = express();

// Provide a single route '/' which responds to all the GET requests with "Welcome"
app.get('/', function (req, res) {
  res.send('Welcome');
});

// Attach the server on the port 8080 on the ip address 0.0.0.0 (All available addresses)
app.listen(8080);
