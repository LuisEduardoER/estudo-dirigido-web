self.addEventListener("message", messageHandler, false);

function messageHandler(event) {
  var selectedFile = event.data[0];
  var imgtag = event.data[1];
  var reader = new FileReader();
  
  reader.onload = function(event) {
	var result = {};
	result[0] = event;
	result[1] = reader;
	self.postMessage(result);
	self.close();
	}
};
