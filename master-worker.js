var categoryRepository = new CategoryRepository();
var currentCode;

$(document).ready(function () {
	loadCategories();
});

$(".modalDialog span[name='btn-no']").click(function () {
	closeModal('.modalDialog');	
	$('.dialog-message').text('');
	$('.dialog-message').hide();
});

function loadCategories() {
	currentCode = 65;
	var categoriesHash = categoryRepository.getAll();
	
	var categories = categoriesHash.hash;	
	if(categories != undefined) {
		$.each(categories, function(id, category) {
			addCategoryToGrid(category);
		}); 
	}
}

function addCategoryToGrid(category) {
	var str = String.fromCharCode(currentCode++);
	
	var row = 
	"<tr>" +
		"<td><p>"+ str +"</p></td>" +
		"<td><img src='"+ category.image +"'></img></td>" +
		"<td><p>"+ category.model +"</p></td>" +
		"<td><a href='maintenance.html'><i title='Visualizar' class='fa fa-info-circle fa-2x'></i></a></td>" +
	"</tr>";
	
	//Adicionando a linha na grid.
	$('#master-grid').append(row);
}

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

function getCurrentYear() {
	var currentDate = new Date();
	var year = currentDate.getFullYear();
	
	return year;
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setTime(dat.getTime() +  (days * 24 * 60 * 60 * 1000));
    return dat;
}

$(".drag-box").on({
    mouseenter: function () {
		var image = $('#drag-img');
		
		if(image.attr('src') == undefined || image.attr('src') == '') {		
			$('.drag-box div').addClass('drag-box-area');
			$('#drag-add').css('display','table-cell');
		}
    },
    mouseleave: function () {
        $('.drag-box div').removeClass('drag-box-area');
		$('#drag-add').hide();
    }
});

function onFileSelected(event) {

	var webWorker;
	if (typeof(Worker) != "undefined") {
		webWorker = new Worker("worker.js");
	
		var imgtag = document.getElementById("drag-img");
		imgtag.title = event.target.files[0].name;
		
		var handle = new function(e) {
			imgtag.src = e.data[0].target.result;
			$('#drag-img').show();
			
			e.data[1].readAsDataURL(event.target.files[0]);
		};
		
		webWorker.addEventListener("message", handle, false); 
	}
	
	webWorker.postMessage('');
}