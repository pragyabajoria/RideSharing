var http = require("http");

function start() {
  function onRequest(request, response) {
    console.log("Request received.");
    // Set the header of the response as a text/plain content
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World"); // Outputs "Hello World"
    response.end(); // Ends the output stream
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

// Put the server code into a function named start and export the function
exports.start = start;
