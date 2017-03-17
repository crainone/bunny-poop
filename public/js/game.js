window.onload = function() {

	var renderer = PIXI.autoDetectRenderer(850, 314);
	renderer.backgroundColor = 0xfffff0;
	document.body.appendChild(renderer.view);

	//TODO: see if it's any more efficient to set a baseUrl here.
	//var loader = new PIXI.loaders.Loader();
	//loader.baseUrl = "/img/";
	var loader = PIXI.loader;

	var stage = new PIXI.Container();
	
	//Pre-load:
	// Load the loading screen itself, plus status bar
	loader.add([
		"/img/loadingPage/cover.jpg",
		"/img/loadingPage/frame.jpg",
		"/img/loadingPage/bar.jpg"
	])
	.on("progress", (loader, resource) => {
		if(resource.error) console.log(resource.error);
	})
	.load(() => {
		var background = new PIXI.Sprite(loader.resources["/img/loadingPage/cover.jpg"].texture);
		stage.addChild(background);
		
		var loadingFrame = new PIXI.Sprite(loader.resources["/img/loadingPage/frame.jpg"].texture);
		stage.addChild(loadingFrame);
		
		var loadingBar = new PIXI.Sprite(loader.resources["/img/loadingPage/bar.jpg"].texture);
		stage.addChild(loadingBar);
		
		//Post-load:
		// Load all resources required by the game
		// TODO: if any resources can be lazy-loaded, do that
		loader.add([
			"/img/bunny.jpg"
		])
		.on("progress", (loader, resource) => {
			if(resource.error) console.log(resource.error);
			console.log("loading %o", resource.name);
			console.log("%o% complete", loader.progress);
		})
		.load(() => {
			var cat = new PIXI.Sprite(loader.resources["/img/bunny.jpg"].texture);
			stage.addChild(cat);

			renderer.render(stage);
		});
	});
	
}