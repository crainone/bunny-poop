/**
 * Interface between BunnyPoop and the server. All methods here should also be reflected in the
 * server file.
 *
 * @class
 * @author Caitlin Rainone
 **/
var ConnectionAPI = class ConnectionAPI {
	
	/**
	 * This probably doesn't need to be a class, actually
	 **/
	constructor() {
		this.ready = false;
		this.api = {
			hello: {method: "GET", url: "/api/login/", fields: {username: "", password: ""}}
		}; //sample api, replace this with the actual results
		
		this.onmessage = function(/*event*/) {  
			//console.log("Worker said: " + event.data);
		};
		
		this.makeRequest("GET", "/api/", response => {
			this.ready = true;
			this.api = response;
		}); //Requesting api will always return available functions
	}
	
	/**
	 * Given an event coming from the game, make the appropriate request of the server
	 *
	 * @function
	 * @see receiveResponse
	 * @param {Event} event The event that caused this handler to react
	 * @returns {String} response provided by server
	 * @author Caitlin Rainone
	 **/
	makeRequest(event) {
		console.log("Making request %o of server", event);
		if (event.data === "Hello") {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "/", false);
			xhr.send(this.receiveResponse);
			console.log("Going to return %o", xhr.responseText);
			return xhr.responseText;
		}
	}
	
	/**
	 * @todo What should this do?
	 * @function
	 * @see makeRequest
	 * @param {Event} event What the server said
	 * @returns {undefined}
	 **/
	receiveResponse(event) {
		console.log("Received response %o", event);
	}
}

var connection = new ConnectionAPI();
self.onmessage = function (event) {
	console.log("got message %o", event);
	self.postMessage(connection.makeRequest(event));
};