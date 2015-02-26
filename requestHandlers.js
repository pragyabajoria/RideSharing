// Introduce a new Node.js module, child_process
// exec is a non-blocking operation that executes a shell command 
// from within js
var exec = require("child_process").exec;

function start(response) {
  console.log("Request handler 'start' was called.");

  // ls -lah lists all the files in the current directory
  // allows us to display the list in the browser of a user requesting the url
  exec("find /",
    { timeout: 10000, maxBuffer: 20000*1024 }, 
    function(error, stdout, stderr) {
      response.writeHead(200, {"Content-Type" : "text/plain"});
      response.write(stdout);
      response.end();
    });
}

function upload(response) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type" : "text/plain"});
  response.write("Hello Upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
