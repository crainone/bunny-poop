var ConnectionAPI = class ConnectionAPI {
	constructor() {
		this.ready = false;
		this.api = {
			hello: {method: "GET", url: "/api/login/", fields: {username: "", password: ""}}
		}; //sample api, replace this with the actual results
		
		this.onmessage = function(event) {  
			console.log("Worker said: " + event.data);
		};
		
		makeRequest("GET", "/api/", response => {
			this.ready = true;
			this.api = response;
		}); //Requesting api will always return available functions
	}
	
	makeRequest(event) {
		if (event.data === "Hello") {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "/", false);
			xhr.send(this.receiveResponse);
			return xhr.responseText;
		}
	}
	
	receiveResponse(event) {
	}
}

var connectionAPI = new ConnectionAPI();
self.onmessage = function (event) {
	console.log(event);
	self.postMessage(connectionAPI.makeRequest(event));
};