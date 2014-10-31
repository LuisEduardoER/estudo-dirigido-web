$(document).ready(function () {

});

$("span[name='btn-no']").click(function () {
	closeModal('.modalDialog');	
	$('.dialog-message').text('');
	$('.dialog-message').hide();
});

function openModal(id) {
	$(id).css('opacity', '1');
	$(id).css('pointer-events', 'auto');
}

function closeModal(id) {
	$(id).css('opacity', '0');
	$(id).css('pointer-events', 'none');
}

function invertColors(elementId) {
	var color = $("#"+elementId).css('color');
	var background = $("#"+elementId).css('background-color');
	
	$("#"+elementId).css('color', background);
	$("#"+elementId).css('background-color', color);
}

function getCurrentDate(days) {
	
	var currentDate = new Date();
	
	if(days > 0) {
		currentDate = currentDate.addDays(days);
	}
	
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    
	return (day + "/" + month + "/" + year);
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() +  (days * 24 * 60 * 60 * 1000));
    return dat;
}