/*
 * Main file to start our HTTP Server
 * @author PragyaBajoria
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/favicon.ico"] = requestHandlers.upload;
server.start(router.route, handle);
