function PageNotFoundException(page, request) {
	this.name = "PageInformationNotFound";
	this.message = "Couldn't find page " + page + " in index " + request;
};

function ResourceNotFoundException(resource) {
	this.name = "ResourceNotFound";
	this.message = "Couldn't find resource " + resource;
};
	
