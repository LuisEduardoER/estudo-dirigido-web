var currentButtonId;
var clientRepository;

$(document).ready(function () {
	clientRepository = new ClientRepository();
	
	//Clientregar todos os clientros do Storage.
	loadClients('all');
});

//FUNÇÕES
function loadClients(filter) {
	$('.grid-row').remove();
	$('.no-register').show();
	
	var clientsHash = clientRepository.getAll();
	
	var clients = clientsHash.hash;	
	if(clients != undefined) {
		$.each(clients, function(register, client) {		 		
			addClientToGrid(client);
		}); 
	}
}

function addClientToGrid(client) {
	$('.no-register').hide();
	
	var row = "<tr id='row_"+ client.number +"' class='grid-row'>" +
		"<td><p>"+ client.name +"</p></td>" +
		"<td><p>"+ client.number +"</p></td>" +
		"<td><a href='"+ client.cnh +"' target='_blank'>Visualizar</a></td>" +
		"<td><span id='del_"+ client.number +"' name='delete' class='grid-button'>X</span></td>" +
	"</tr>";
	
	//Adicionando a linha na grid.
	$('#clients-grid').append(row);
}

function deleteClient(clientId) {
	//Remover do Storage.
	clientRepository.remove(clientId);

	//Removedo a linha referente ao clientro selecionado.
	$('#row_'+clientId).remove();	
}

//EVENTOS
$('#btn-yes').click(function () {
	closeModal('#confirmation-delete');
	 
	var clientId = currentButtonId.replace('del_','');
	
	deleteClient(clientId);	
});

$('#btn-insert-client').click(function () {	
	//Inserindo um novo carro no Storage.
	var name = $('#txt-name').val();
	var number = $('#txt-number').val();
	var cnh = $('#drag-img').attr('src');

	var client = new Client(name, number, cnh);
	
	clientRepository.insert(client);
	client = clientRepository.get(client.number);
	
	addClientToGrid(client);
	
	$('#txt-name').val('');
	$('#txt-number').val('');
	$('#drag-img').attr('src','');	
	$('#drag-img').hide();
	$('#input-cnh').val('');
});

// Disparado quando algum botão da grid for pressionado.
$('#clients-grid').on('click', '.grid-button', function(e) {
	var id = e.target.id;
	var name = $('#'+id).attr('name');
	
	currentButtonId = e.target.id;
	openModal('#confirmation-delete');	
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

$(".drag-box").on({
    mouseenter: function () {
		var image = $('#drag-img');
		
		if(image.attr('src') == undefined || image.attr('src') == '') {		
			$('.drag-box div').addClass('drag-box-area');
			$('#drag-add').addClass('drag-box-add');
			$('#drag-add').text('+');
		}
    },
    mouseleave: function () {
        $('.drag-box div').removeClass('drag-box-area');
		$('#drag-add').text('');
		$('#drag-add').removeClass('drag-box-add');
    }
});

$('#drag-add, #drag-img').click(function () {	
	$('#input-cnh').trigger('click');
});
