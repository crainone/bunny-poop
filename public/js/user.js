var BunnyPoopUser = class BunnyPoopUser {
	constructor() {
		this.connection = new Worker("/js/connection.js");
		this.connection.postMessage(); //Post a blank message to initialize the connection
		
		this.moveSet = []; //What the user has done
	}
}