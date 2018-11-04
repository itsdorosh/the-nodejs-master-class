/**
 * Primary file for the API
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function (req, res) {

    // Get url and parse it.
    const parseURL = url.parse(req.url, true);

    // Get path
    const path = parseURL.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parseURL.query;

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder("utf-8");
    let buffer = "";

    req.on("data", function (data) {
        buffer += decoder.write(data);
    });

    req.on("end", function () {
        buffer += decoder.end();

        // send to response
        res.end("Hello World\n");

        // log the request path.
        console.log(`
            Request received on path: ${trimPath}.
            Request was w/ this method: ${method}.
            Query string parameters: ${JSON.stringify(queryStringObject)}.
            Request received w/ headers: ${JSON.stringify(headers)};
            Request received w/ payload: ${buffer};
        `);
    });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now.");
});
