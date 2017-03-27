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
	 * @param {Event} event The event that caused this handler to react
	 * @returns {String} response provided by server
	 * @author Caitlin Rainone
	 **/
	makeRequest(event) {
		if (event.data === "Hello") {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "/", false);
			xhr.send(this.receiveResponse);
			return xhr.responseText;
		}
	}
	
	/**
	 * @todo What should this do?
	 * @returns {undefined}
	 **/
	receiveResponse(/*event*/) {
	}
}

var connection = new ConnectionAPI();
self.onmessage = function (event) {
	self.postMessage(connection.makeRequest(event));
};