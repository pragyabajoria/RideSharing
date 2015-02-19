/*
 * Main file to start our HTTP Server
 * @author PragyaBajoria
 */
var server = require("./server");
var router = require("./router");

server.start(router.route);
