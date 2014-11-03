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
		"<td><a title='Visualizar' class='grid-link' href='"+ client.cnh +"' target='_blank'><i class='fa fa-picture-o'></i></a></td>" +
		"<td><span id='del_"+ client.number +"' name='delete' class='grid-button fa fa-close'></span></td>" +
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
$("#confirmation-delete span[name='btn-yes']").click(function () {
	closeModal('#confirmation-delete');
	 
	var clientId = currentButtonId.replace('del_','');
	
	deleteClient(clientId);	
});

$('#btn-insert-client').click(function () {	
	//Limpa erros
	$('#dialog-validation-info ul li').remove();
	
	//Inserindo um novo carro no Storage.
	var name = $('#txt-name').val();
	var number = $('#txt-number').val();
	var cnh = $('#drag-img').attr('src');
	
	//validando dados
	
	var re = /^[A-Za-z\s]+$/;
	var str = {};
	
	if (!re.test(name)) {
		str[0] = "Nome inválido. Apenas letras são permitidas";
	}
	re = /\d{11}/;
	if (!re.test(number)) {
		str[1] = "CPF inválido. São necessários 11 dígitos.";
	}
	if ($.isEmptyObject(cnh)) {
		str[2] = "CNH não enviada.";
	}
	
	if ($.isEmptyObject(str)) {
		var client = new Client(name, number, cnh);
		
		clientRepository.insert(client);
		client = clientRepository.get(client.number);
		
		addClientToGrid(client);
		
		$('#txt-name').val('');
		$('#txt-number').val('');
		$('#drag-img').attr('src','');	
		$('#drag-img').hide();
		$('#input-cnh').val('');
	} else {
		addValidationError(str);
	}
	
});

function addValidationError(str) {
$.each(str, function(id, error) {
   $('#dialog-validation-info ul').append("<li>"+ error +"</li>");
  });
  
openModal('#dialog-validation-info');
}

// Disparado quando algum botão da grid for pressionado.
$('#clients-grid').on('click', '.grid-button', function(e) {
	var id = e.target.id;
	var name = $('#'+id).attr('name');
	
	currentButtonId = e.target.id;
	openModal('#confirmation-delete');	
});

$('#drag-add, #drag-img').click(function () {	
	$('#input-cnh').trigger('click');
});
