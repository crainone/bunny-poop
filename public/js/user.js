var BunnyPoopUser = class BunnyPoopUser {
	constructor() {
		this.connection = new Worker("/js/connection.js");  
		this.connection.onmessage = function(event) {  
			console.log("Worker said: " + event.data);
		};
		this.connection.postMessage("Hello");
	}
}