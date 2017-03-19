var BunnyPoop = class BunnyPoop {
	constructor() {
		this.renderer = PIXI.autoDetectRenderer(850, 312, {antialias: false, resolution: 1});
		this.renderer.view.style.border = "5px solid red";
		this.renderer.backgroundColor = 0xfffff0;
		this.loader = PIXI.loader;
		this.stage = new PIXI.Container();
		this.Sprite = PIXI.Sprite;
		
		this.userData = new BunnyPoopUser();
		
		this.imageMap = {
			loadingPage: [
				{name: "loadingBackground", sprite: null, url: "/img/loadingPage/cover.jpg", initialX: 0, initialY: 0},
				{name: "loadingFrame", sprite: null, url: "/img/loadingPage/frame.jpg", initialX: 335, initialY: 148},
				{name: "loadingBar", sprite: null, url: "/img/loadingPage/bar.jpg", initialX: 335, initialY: 148}
			],
			menuPage: [
				{name: "menuOption1", sprite: null, url: "/img/bunny.jpg", initialX: 0, initialY: 0},
				{name: "menuOption2", sprite: null, url: "/img/bunny2.jpg", initialX: 50, initialY: 0},
				{name: "menuOption3", sprite: null, url: "/img/bunny3.jpg", imitialX: 0, initialY: 50}
			]
		};
	}
	
	/**
	 * Sprite behavior functions
	 **/
	updateProgressBar(progressPercent) {
		var progressBar = this.getProgressBarSprite();
		progressBar.width = 2*progressPercent;
		this.renderer.render(this.stage);
	}
	
	getProgressBarSprite() {
		return this.imageMap.loadingPage[2].sprite;
	}

	/**
	 * General page manipulation functions
	 **/
	setupPage(page) {
		this.getImagesForPage(page)
			.map((pageImage) => this.setupSprite(page, pageImage));
	}
	
	setupSprite(page, image) {
		if(this.imageMap[page]) {
			var sprite = this.getSprite(image.name);
			sprite.position.set(image.initialX, image.initialY);
			image.sprite = sprite;
			this.stage.addChild(sprite);
			return sprite;
		} else throw new PageNotFoundException(page, "imageMap");
	}
	
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
		this.renderer.render(this.stage);

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
		this.renderer.render(this.stage);
	}
	
}

window.onload = function() {
	var bp = new BunnyPoop();

	//Add the canvas to the HTML document
	document.body.appendChild(bp.renderer.view);

	bp.setup();
}

