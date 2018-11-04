/**
 * Primary file for the API
 */

// Dependencies
var http = require("http");
var url = require("url");

// The server should respond to all requests with a string
var server = http.createServer(function(req,res){

    // Get url and parse it.
    var parseURL = url.parse(req.url, true);

    // Get path
    var path = parseURL.pathname;
    var trimPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parseURL.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // send to response
    res.end("Hello World\n");

    // log the request path.
    console.log(`
    Request received on path: ${trimPath}.
    Request was w/ this method: ${method}.
    Query string parameters: ${JSON.stringify(queryStringObject)};
    `);
});

// Srart the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log("The server is listening on port 3000 now.");
});
