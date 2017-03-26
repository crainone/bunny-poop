/**
 * The BunnyPoop game's main object. There should only be one.
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
	 * @author Caitlin Rainone
	 **/
	constructor() {
		//PIXI aliases
		var renderer = PIXI.autoDetectRenderer(850, 312, {antialias: false, resolution: 1});
		renderer.view.style.border = "5px solid red";
		renderer.backgroundColor = 0xfffff0;
		var loader = PIXI.loader;
		var stage = new PIXI.Container();
		var Sprite = PIXI.Sprite;
		
		//Initial user
		var userData = new BunnyPoopUser();
		
		/**
		 * Images to be loaded by each page. The map contains pages, which are arrays of image
		 * descriptions. Each image description contains enough information for the loader to
		 * build a new sprite, and also caches the sprite when it is created.
		 *
		 * @member {Object}
		 * @author Caitlin Rainone
		 **/
		var imageMap = {
			loadingPage: [],
			menuPage: []
		};
		imageMap.loadingPage.add(new Image("loadingBackground", "/img/loadingPage/cover.jpg", 0, 0));
		imageMap.loadingPage.add(new Image("loadingFrame", "/img/loadingPage/frame.jpg", 335, 148));
		imageMap.loadingPage.add(new Image("loadingBar", "/img/loadingPage/bar.jpg", 335, 148));
		imageMap.menuPage.add(new Image("menuOption1", "/img/bunny.jpg", 0, 0));
		imageMap.menuPage.add(new Image("menuOption2", "/img/bunny2.jpg", 50, 0));
		imageMap.menuPage.add(new Image("menuOption3", "/img/bunny3.jpg", 0, 50));
	}
	
	/**
	 * One image. Starts with its image location and name, may get a sprite later.
	 * @todo Logically, shouldn't this extend a Sprite?
	 *
	 * @class
	 * @see imageMap
	 * @author Caitlin Rainone
	 **/
	var Image = class ImageObject {
		this.sprite = null; //Only construct the sprite after it's needed. This might be never.
		
		/**
		 * @constructor
		 * @param {String} name Name to be used by the PIXI resource loader
		 * @param {String} url Location of the image on the server
		 * @param {int} initialX, initialY Coordinates on the stage to place the sprite
		 * @author Caitlin Rainone
		 **/
		constructor(name, url, initialX, initialY) {
			this.name = name;
			this.url = url; //Should be /img/{page name}/{image name}.jpg
			this.initialX = initialX;
			this.initialY = initialY;
		}
		
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
	 * @param progressPercent How much of the app has loaded, out of 100
	 * @author Caitlin Rainone
	 **/
	updateProgressBar(progressPercent) {
		var progressBar = this.getProgressBarSprite();
		progressBar.width = 2*progressPercent;
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
	 * @return sprite for the progress bar
	 * @author Caitlin Rainone
	 **/
	getProgressBarSprite() {
		return this.imageMap.loadingPage[2].sprite;
	}

	/*****************************************************************************************
	 * General page manipulation functions
	 *****************************************************************************************/
	
	/**
	 * For any page, build the sprites that make up that page in their initial locations.
	 *
	 * @function
	 * @param {String} page Name of the page to load
	 * @throws PageNotFoundException If the string doesn't match the name of a page in the
	 * imageMap
	 * @author Caitlin Rainone
	 **/
	setupPage(page) {
		this.getImagesForPage(page)
			.map((pageImage) => this.setupSprite(page, pageImage));
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
	 * @returns {Sprite}
	 * @throws PageNotFoundException If the string doesn't match the name of a page in the
	 * imageMap
	 * @author Caitlin Rainone
	 **/
	setupSprite(page, image) {
		if(this.imageMap[page]) {
			var sprite = this.getSprite(image.name);
			sprite.position.set(image.initialX, image.initialY);
			image.sprite = sprite;
			this.stage.addChild(sprite);
			return sprite;
		} else throw new PageNotFoundException(page, "imageMap");
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
		if(!name) return;
		if(this.loader.resources[name]) 
			return new this.Sprite(this.loader.resources[name].texture);
		else throw new ResourceNotFoundException(name);
	}

	getImagesForPage(page) {
		if(this.imageMap[page])
			return this.imageMap[page];
		else throw new PageNotFoundException(page, "imageMap");
	}

	/**
	 * Initial startup functions
	 **/
	setup() {
		this.loader
			.add(this.getImagesForPage("loadingPage"))
			.load(() => this.loading());	
	}
	
	loading() {
		this.setupPage("loadingPage");

		this.loader.reset();
		this.loader
			.add(this.getImagesForPage("menuPage"))
			.on("progress", (loader, resource) => {
				console.log("loading: " + resource.url); 
				console.log("progress: " + loader.progress + "%");
				this.updateProgressBar(loader.progress);
			})
			.load(() => this.menu());	
	}
	
	menu() {
		this.setupPage("menuPage");
	}
	
}

window.onload = function() {
	//Get a game instance
	var bp = new BunnyPoop();

	//Add the canvas to the HTML document
	document.body.appendChild(bp.renderer.view);

	//Start the game
	bp.setup();
}

