var path = require("path");
var express = require("express");
var app = express();
var fs = require("fs");

var dir = path.join(__dirname, "..", "public");

var mime = {
    html: "text/html",
    txt: "text/plain",
    css: "text/css",
    gif: "image/gif",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    js: "application/javascript"
};

app.get("*", function (request, response) {
	console.log(request);
    var file = path.join(dir, request.path.replace(/\/$/, "/index.html"));
    if (file.indexOf(dir + path.sep) !== 0) {
        return response.status(403).end("Forbidden");
    }
	
    var type = mime[path.extname(file).slice(1)] || "text/plain";
    var s = fs.createReadStream(file);
    s.on("open", function () {
        response.set("Content-Type", type);
        s.pipe(response);
    });
    s.on("error", function (err) {
		response.set("Content-Type", "text/plain");
        response.status(404).end("Not found");
    });
});

app.listen(8080, function () {
    console.log("Listening on http://localhost:8080/");
});