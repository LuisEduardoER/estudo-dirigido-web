var urlModel;
var carRepository;
var categoryRepository;

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
	urlModel = decodeURIComponent($.urlParam('model'));
	$('#h-title').text(urlModel);
	
	carRepository = new CarRepository();
	categoryRepository = new CategoryRepository();
	
	loadCarInfo();
});

function loadCarInfo() {
	var category = categoryRepository.get(urlModel);
	
	
	var info = category.info.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
	$('#info-area').append("<p class='input-area'>"+info+"</p>");
}

