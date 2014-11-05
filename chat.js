var urlModel;
var carRepository;
var categoryRepository;
var localUser;
var users = [];
var connection;

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}


$(document).ready(function () {
	connection = new WebSocket('ws://html5rocks.websocket.org/echo', ['soap', 'xmpp']);
	configWebSocket();
	
	urlModel = decodeURIComponent($.urlParam('model'));
	$('#h-title').text(urlModel+" Chat");
	
	carRepository = new CarRepository();
	categoryRepository = new CategoryRepository();
	
	loadCarInfo();
});

function loadCarInfo() {
	var category = categoryRepository.get(urlModel);
	
	if(category != undefined) {
		var info = category.info.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		$('#info-area').append("<p class='input-area'>"+info+"</p>");
	}
}

$('.message-region span').click(function () {
	localUser = $('#txt-user').val();
	var info = $('#txt-message').val();
	
	if(localUser != '' && info != '') {
		var message = {};
		message.user = localUser;
		message.info = info;
		message.date = getCurrentDateTime();
		$('#txt-message').val('');
		
		//Mandar pro servidor !
		connection.send(JSON.stringify(message));				
	}	
});

function addMessageToGrid(message) {
	var local = (message.user == localUser) ? 'right' : 'left';
	
	var messageHtml =
	"<div class='bubble "+ local +"'>" +
		"<div class='container'>" +
			"<div class='row'>" +
				"<p class='message-user'>"+ message.user +"</p>" +
				"<p class='message-date'>"+ message.date +"</p>" +
			"</div>" +
		"</div>" +
		"<p>"+ message.info +"</p>" +
	"</div>";
	
	$('#bubles').prepend(messageHtml);
}

function addParticipantToGrid(user) {
	var exist = false;
	
	for(var i=0; i<users.length; i++) {
		if(users[i] == user) {
			exist = true;
			break;
		}		
	}
	
	if(!exist) {	
		users.push(user);
	
		$('#num-users').text(users.length);
		$('.participants-area').append("<p><i class='fa fa-user'></i>"+ user +"</p>");
	}
}

function configWebSocket() {
	connection.onopen = function () {
	  console.log('ping'); // Send the message 'Ping' to the server
	};

	// Log errors
	connection.onerror = function (error) {
	  console.log('WebSocket Error ' + error);
	};

	// Log messages from the server
	connection.onmessage = function (e) {		
		var message = JSON.parse(e.data);
		addMessageToGrid(message);			
		addParticipantToGrid(message.user);
	};
}
