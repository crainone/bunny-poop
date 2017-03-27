/**
 * Information about the user currently playing the game, including the moves made by that user
 *
 * @class
 * @author Caitlin Rainone
 **/
var BunnyPoopUser = class BunnyPoopUser {
	
	/**
	 * Make a connection to the server (one per user) and start posting moves. Set up a place to
	 * store moves that couldn't be sent for whatever reason, to be sent later.
	 *
	 * @constructor
	 * @author Caitlin Rainone
	 **/
	constructor() {
		this.connection = new Worker("/js/connection.js");
		this.connection.postMessage(); //Post a blank message to initialize the connection
		
		this.moveSet = []; //What the user has done
	}
}

module.exports = BunnyPoopUser;