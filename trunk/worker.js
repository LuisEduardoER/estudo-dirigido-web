self.addEventListener("message", messageHandler, false);

function messageHandler(e) {
	console.log(event.data);
  var reader = new FileReader();
  
  reader.onload = function(event) {
	var result = {};
	result[0] = event;
	result[1] = reader;
	self.postMessage(result);
  }
};
