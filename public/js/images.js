/*eslint no-magic-numbers: 0*/
/*ImageMap should probably just be a .json file to load, but this works for now and keeps the
  ImageObject attached*/
/**
 * One image. Starts with its image location and name, may get a sprite later.
 * @todo Logically, shouldn't this extend a Sprite?
 *
 * @class
 * @see imageMap
 * @author Caitlin Rainone
 **/
var ImageObject = class ImageObject {

	/**
	 * @constructor
	 * @param {String} name Name to be used by the PIXI resource loader
	 * @param {String} url Location of the image on the server
	 * @param {int} initialX Coordinates on the stage to place the sprite (horizontal)
	 * @param {int} initialY Coordinates on the stage to place the sprite (vertical)
	 * @author Caitlin Rainone
	 **/
	constructor(name, url, initialX, initialY) {
		this.name = name;
		this.url = url; //Should be /img/{page name}/{image name}.jpg
		this.initialX = initialX;
		this.initialY = initialY;
		this.sprite = null; //Only construct the sprite after it's needed. This might be never.
	}
};

/**
 * Images to be loaded by each page. The map contains pages, which are arrays of image
 * descriptions. Each image description contains enough information for the loader to
 * build a new sprite, and also caches the sprite when it is created.
 *
 * @class
 * @author Caitlin Rainone
 **/
var ImageMap = {
	loadingPage: {
		loadingBackground: new ImageObject("loadingBackground", "/img/loadingPage/cover.jpg", 0, 0),
		loadingFrame: new ImageObject("loadingFrame", "/img/loadingPage/frame.jpg", 335, 148),
		loadingBar: new ImageObject("loadingBar", "/img/loadingPage/bar.jpg", 335, 148)
	},
	menuPage: {
		menuOption1: new ImageObject("menuOption1", "/img/bunny.jpg", 0, 0),
		menuOption2: new ImageObject("menuOption2", "/img/bunny2.jpg", 50, 0),
		menuOption3: new ImageObject("menuOption3", "/img/bunny3.jpg", 0, 50)
	}
};

module.exports = ImageMap;