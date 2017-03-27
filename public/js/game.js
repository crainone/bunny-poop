/*From errors.js*/
var PageNotFoundException = require("PageNotFoundException");
var ResourceNotFoundException = require("ResourceNotFoundException");

/*From pixi.js*/
var PIXI = require("PIXI");

/*From images.js*/
var ImageMap = require("ImageMap");

/*From user.js*/
//var BunnyPoopUser = require("BunnyPoopUser");

//Width of the frame of the loading bar. Used to calculated how wide the bar itself should be
const PROGRESS_FRAME_WIDTH = 200;

/**
 * The BunnyPoop game's main object. There should only be one. Strictly speaking, this should deal
 * with no game rules here, and just handle display operations.
 *
 * @class
 * @author Caitlin Rainone
 **/
var BunnyPoop = class BunnyPoop {
		
	/**
	 * Keep this small, heavier loading should be done in the loading() function in order to
	 * provide a progress bar. Should contain:
	 *  - alias setup for PIXI objects
	 *  - assigning the user (to be filled in on authentication)
	 *  - the map of resources used by each page of the game, to be loaded later [1]
	 *
	 * [1] Note: I'm not sure how large this is going to get, may need to only contain the
	 * resource for initial screens, with later ones defined later.
	 *
	 * @constructor
	 * @param {int} stageWidth Size of the game window (horizontal)
	 * @param {int} stageHeight Size of the game window (vertical)
	 * @author Caitlin Rainone
	 **/
	constructor(stageWidth, stageHeight) {
		//PIXI aliases
		var loader = PIXI.loader;
		if (!loader) {
			return;
		}
		var Sprite = PIXI.Sprite;
		if (!Sprite) {
			return;
		}
		var renderer = PIXI.autoDetectRenderer(
			stageWidth, 
			stageHeight, 
			{antialias: false, resolution: 1});
		renderer.view.style.border = "5px solid red";
		renderer.backgroundColor = 0xfffff0;
		var stage = new PIXI.Container();
		if (!stage) {
			return;
		}
		//Resource map
		var imageMap = ImageMap;
		if (!imageMap) {
			//return;
		}
		//Initial user
		/*this.userData = new BunnyPoopUser();
		if (this.userData.moveSet.contains("foo")) {
			this.userData = null;
		}*/
	}
	
	/*****************************************************************************************
	 * Sprite behavior functions
	 *
	 * TODO: maybe make these their own files?
	 *****************************************************************************************/
	
	/**
	 * Widen the progress bar to the appropriate size. Since the progress bar container is 200px,
	 * the progress bar itself should be (2*progressPercent) pixels wide (the progress bar is
	 * placed to overlap the frame horizontally). Note that it is possible to roll back progress
	 * using this method, since there's no requirement that the progressPercent increase in
	 * subsequent calls.
	 *
	 * @function
	 * @param {int} progressPercent How much of the app has loaded, out of 100
	 * @returns {undefined}
	 * @author Caitlin Rainone
	 **/
	updateProgressBar(progressPercent) {
		var progressBar = this.getProgressBarSprite();
		progressBar.width = progressPercent * PROGRESS_FRAME_WIDTH;
		this.renderer.render(this.stage);
	}
	
	/**
	 * Return the sprite that represents the progress bar. It should be something that makes
	 * sense to resize horizontally. It's currently just a plain rectangle, but can be redone
	 * into a gradient or something else more attractive.
	 * @todo If you try to call this and there isn't already a sprite in place, warn then create
	 * one.
	 *
	 * @function
	 * @see updateProgressBar
	 * @returns {Sprite} sprite for the progress bar
	 * @author Caitlin Rainone
	 **/
	getProgressBarSprite() {
		return this.imageMap.loadingPage.loadingBar.sprite;
	}

	/*****************************************************************************************
	 * General page manipulation functions
	 *****************************************************************************************/
	
	/**
	 * For any page, build the sprites that make up that page in their initial locations.
	 *
	 * @function
	 * @param {String} page Name of the page to load
	 * @returns {undefined}
	 * @throws PageNotFoundException If the string doesn't match the name of a page in the
	 * imageMap
	 * @author Caitlin Rainone
	 **/
	setupPage(page) {
		this.getImagesForPage(page)
			.map(pageImage => this.setupSprite(page, pageImage));
		this.renderer.render(this.stage);
	}
	
	/**
	 * Given a page and an image, build a sprite on that page using the given image. Note that
	 * nothing checks if the image already has a sprite, this function will always create a new
	 * one in the initial location, overwriting the sprite that had existed.
	 * @todo Should it try to use the sprite cache? The loader already handles it, sort of.
	 *
	 * @function
	 * @see setupPage
	 * @param {String} page Name of a page to place the sprite on
	 * @param {Image} image Image description, from the imageMap
	 * @returns {Sprite} Sprite built from the image in the loader
	 * @throws PageNotFoundException If the string doesn't match the name of a page in the
	 * imageMap
	 * @author Caitlin Rainone
	 **/
	setupSprite(page, image) {
		if (this.imageMap[page]) {
			var sprite = this.getSprite(image.name);
			sprite.position.set(image.initialX, image.initialY);
			image.sprite = sprite;
			this.stage.addChild(sprite);
			return sprite;
		}
		throw new PageNotFoundException(page, "imageMap");
	}
	
	/**
	 * The image named should already be added to the loader, if so, build a Sprite from it and
	 * return it. This function doesn't care if the image already has a sprite in the imageMap.
	 * @todo If the resource can't be found, should probably just add it instead and warn.
	 *
	 * @function
	 * @see setupSprite
	 * @param {String} name Resource name as provided to the loader
	 * @returns {Sprite} Sprite built from the image in the loader
	 * @throws ResourceNotFoundException If the image wasn't given to the loader ahead of time
	 * @author Caitlin Rainone
	 */
	getSprite(name) {
		if (name && this.loader.resources[name]) {
			return new BunnyPoop.Sprite(this.loader.resources[name].texture);
		}
		throw new ResourceNotFoundException(name);
	}

	/**
	 * Given the name of a page, return the images associated with it
	 *
	 * @function
	 * @param {String} page Name of the page in imageMap
	 * @returns {ImageObject[]} Images belonging to the given page
	 * @throws PageNotFoundException If the string doesn't match the name of a page in the
	 * imageMap
	 * @author Caitlin Rainone
	 **/
	getImagesForPage(page) {
		if (this.imageMap[page]) {
			return this.imageMap[page];
		}
		throw new PageNotFoundException(page, "imageMap");
	}

	/**
	 * Initial startup function. Loads the loading page then causes the rest of the loading
	 * process once the loading page is ready
	 *
	 * @function
	 * @returns {undefined}
	 * @author Caitlin Rainone
	 **/
	setup() {
		this.loader
			.add(this.getImagesForPage("loadingPage"))
			.load(() => this.loading());	
	}
	
	/**
	 * After setting up the loading page itself, start the loading process
	 *
	 * @function
	 * @see setup
	 * @returns {undefined}
	 * @author Caitlin Rainone
	 **/
	loading() {
		this.setupPage("loadingPage");

		this.loader.reset();
		this.loader
			.add(this.getImagesForPage("menuPage"))
			.on("progress", loader => {
				//console.log("loading: " + resource.url); 
				//console.log("progress: " + loader.progress + "%");
				this.updateProgressBar(loader.progress);
			})
			.load(() => this.menu());	
	}
	
	/**
	 * Load the menu page
	 *
	 * @function
	 * @see loading
	 * @returns {undefined}
	 * @author Caitlin Rainone
	 **/
	menu() {
		this.setupPage("menuPage");
	}
	
};
	
window.onload = function() {
	//Get a game instance
	const STAGE_WIDTH = 850;
	const STAGE_HEIGHT = 312;	
	var bp = new BunnyPoop(STAGE_WIDTH, STAGE_HEIGHT);
	//Add the canvas to the HTML document
	document.body.appendChild(bp.renderer.view);

	//Start the game
	bp.setup();
}