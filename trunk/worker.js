self.addEventListener("message", messageHandler, false);

function messageHandler(event) {
  var reader = new FileReader();
  
  reader.onload = function(event) {
	var result = {};
	result[0] = event;
	result[1] = reader;
	self.postMessage(result);
	self.close();
	}
};
