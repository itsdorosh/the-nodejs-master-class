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

        // Choose the handler this request should go to.
        const chosenHandler = typeof(router[trimPath]) !== 'undefined' ? router[trimPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimPath,
            queryStringObject,
            method,
            headers,
            buffer
        };

        // Route the request to the handler specify in the router
        chosenHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;

            // Use the payload called back by the handler, or default to
            payload = typeof(payload) === "object" ? payload: {};

            // Convert payload to a string
            const payloadString = JSON.stringify(payload);

            // send to response
            res.writeHead(statusCode);
            res.end(payloadString);

            // log the request path
            console.log("Returning the response:", statusCode, payloadString);
        });

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

// Define a request router
const handlers = {};

handlers.sample = function (data, callback) {
    // callback a http status code, and a payload object
    callback(406, {"name": "sample handler"});
};

handlers.notFound = function (data, callback) {
    callback(404);
};

const router = {
    'sample': handlers.sample
};
