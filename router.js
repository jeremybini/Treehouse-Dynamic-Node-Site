//consider a route function that checks for route, and then calls corresponding function below
var Profile = require("./profile.js");
var renderer = require('./renderer.js');
var querystring = require('querystring');

var commonHeader = {'Content-Type': 'text/html'};

//Handle HTTP route GET / and POST / ie Home
function home(request, response) {
	// if url == "/"
	if (request.url === '/') {
		//if a GET request
		if (request.method.toLowerCase() === 'get') {
			// show search
			response.writeHead(200, commonHeader);
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();

		// if POST request
		} else {
			// get POST data from body
			request.on('data', function(postBody) {
				//extract username to json object
				var query = querystring.parse(postBody.toString());

				// redirect to /:username
				response.writeHead(303, { 'Location': '/'+query.username });
				response.end();
			})
		}
	}
}

//Handle HTTP route GET /:username ie /jeremybini
function user(request, response) {
	//if url == "/.."
	var username = request.url.replace('/', "");
	if (username.length > 0) {
		response.writeHead(200, commonHeader);
		renderer.view("header", {}, response);
		
		//get json from Treehouse
		var studentProfile = new Profile(username);

		//on 'end'
		studentProfile.on('end', function (profileJSON) {
			//store values which we need
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.name,
				badges: profileJSON.badges.length,
				javascriptPoints: profileJSON.points.JavaScript
			}
			//simple response
			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
		})
				
		//on 'error'
		studentProfile.on('error', function (error) {
			//show error
			renderer.view("error", { errorMessage: error.message }, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		})
				
		
	}
}

module.exports.home = home;
module.exports.user = user;