var categoryRepository = new CategoryRepository();
var carRep = new CarRepository();
var clientRep = new ClientRepository();
var rentRep = new RentRepository();
var currentCode;

$(document).ready(function () {
	loadCategories();
});

$(".modalDialog span[name='btn-no']").click(function () {
	closeModal('.modalDialog');	
	$('.dialog-message').text('');
	$('.dialog-message').hide();
	$('textarea').val('');
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
		"<td><a href='chat.html?model="+ category.model +"'><i title='Visualizar' class='fa fa-info-circle fa-2x'></i></a></td>" +
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

function getCurrentDateTime() {
	var currentDate = new Date();
	var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
	var hour = currentDate.getHours();
	var min = currentDate.getMinutes();
    
	return (day + "/" + month + "/" + year + " às " + hour + ":" + min);
	
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
  var selectedFile = event.target.files[0];
  var reader = new FileReader();

  var imgtag = document.getElementById("drag-img");
  imgtag.title = selectedFile.name;

  reader.onload = function(event) {
    imgtag.src = event.target.result;
	$('#drag-img').show();
  };

  reader.readAsDataURL(selectedFile);
}

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function getEntityBackup(type) {
	var entityHash;
	var fileName = '';
	
	switch(type) {
		case 'cars':
			fileName = 'Backup_Carros';
			entityHash = carRep.getAll();
			break;
		case 'clients':
			fileName = 'Backup_Clientes';
			entityHash = clientRep.getAll();
			break;
		case  'rents':
			fileName = 'Backup_Alugueis';
			entityHash = rentRep.getAll();
			break;
		case 'categories':
			fileName = 'Backup_Categorias';
			entityHash = categoryRepository.getAll();
			break;
	}
	
	var fileText = '';
	var entities = entityHash.hash;	
	if(entities != undefined) {
		$.each(entities, function(id, entity) {
			fileText += JSON.stringify(entity) + '\r\n';
		}); 
	}	
	
	return { fileName: fileName, fileText: fileText };
}

$("#dialog-backup span[name='btn-yes']").click( function () {
	var type = $("input[name='backup']:checked").val();
	var data = getEntityBackup(type);
	
	var textFileAsBlob = new Blob([data.fileText], {type:'text/json'});
	var fileNameToSaveAs = data.fileName;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();	
	closeModal('#dialog-backup');
});

$('#btn-backup').click(function () {
	openModal('#dialog-backup');	
});