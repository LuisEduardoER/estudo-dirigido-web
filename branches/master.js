$(document).ready(function () {

});

$('#btn-no').click(function () {
	closeModal('.modalDialog');
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

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    // var data = ev.dataTransfer.getData("text/plain");
    // ev.target.appendChild($(data)[0]);
	var files = ev.dataTransfer.files;
	ev.target.appendChild(files[0]);
}