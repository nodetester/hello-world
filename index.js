//Dependencies

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


//Create an http server
//The server should respond to all requests with a string
var server = http.createServer( function (req, res){

    //get the URL, parse the path
    var parsedURL = url.parse(req.url, 'true');
    //console.log(parsedURL);

    //Parse path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    // console.log(path);

    //Get the Query string as an object
    var queryString = parsedURL.query;
    // console.log(queryString);

    //Parse the headers 
    var head = req.headers;
    // console.log(head);

    //Parse the method 
    var method = req.method;
    // console.log(method);

    //Parse the statuscode

    //Convert the buffer payload into utf-8 and parse it
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(chunk){
        buffer += decoder.write(chunk);
    });
    req.on('end', function(){
        buffer += decoder.end();

        //Choose the handler this request should go to. If one doesnt exist, use default handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.default;
        console.log (router[trimmedPath]);
        //Construct the data object to send to the handler
        var data = {
            'payload': buffer,
            'trimmedPath': trimmedPath,
            'method' : method,
            'queryString': queryString,
            'headers': head
        };

        //Route the request to the handler chosen above
        chosenHandler(data, function(status, payload){
            //Use the status code called back by the handler or default to 200
            status = typeof(status) == 'number' ? status : 200

            //Use the payload called back by the handler or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //Send the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(status);
            res.end(payloadString);
            console.log('Server response', status, payloadString)
        });
    });
});





//Start the server, Listen to incoming requests
server.listen(2010, function(){
    console.log('serverlistening');
});

//Create handlers to handle requests to different paths
var handlers = {};

handlers.hello = function(data, cb){
    cb(200, {'hi': 'there!'});
};

handlers.default = function(data, cb){
    cb(404, {'not': 'found'});
};

//Route requests based on path

var router = {
    'hello' : handlers.hello,
    'default' : handlers.default
};