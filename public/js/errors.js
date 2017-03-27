/**
 * PageNotFoundException
 * If the page given isn't in the imageMap, throw an error.
 *
 * @class
 * @see BunnyPoop.imageMap
 * @param {String} page Name of the page to look for
 * @param {Object} imageMap Map of strings to arrays of Images that the key "page" is missing from
 * @author Caitlin Rainone
 **/
function PageNotFoundException(page, imageMap) {
	this.name = "PageInformationNotFound";
	this.message = "Couldn't find page " + page + " in index " + imageMap;
}

/**
 * ResourceNotFoundException
 * If an image hasn't been added to the loader before being used, throw an error.
 *
 * @class
 * @see BunnyPoop.loader
 * @param {Image} resource The Image that failed to load
 * @author Caitlin Rainone
 **/
function ResourceNotFoundException(resource) {
	this.name = "ResourceNotFound";
	this.message = "Couldn't find resource " + resource;
}

module.exports = PageNotFoundException;
module.exports = ResourceNotFoundException;