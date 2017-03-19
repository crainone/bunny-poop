self.onmessage = function (event) {
  if (event.data === "Hello") {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/", false);
    xhr.send(null);
    self.postMessage(xhr.responseText);
  }
};