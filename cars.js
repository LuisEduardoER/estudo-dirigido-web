var currentButtonId;
var carRepository;
var rentRepository;
var hasErrors = false;

$(document).ready(function () {	
	carRepository = new CarRepository();
	rentRepository = new RentRepository();
	
	//Carregar todos os carros do Storage.
	loadCars('all');
});

//FUNÇÕES
function loadCars(filter) {
	$('.grid-row').remove();
	$('.no-register').show();
	
	var carsHash = carRepository.getAll();
	
	var cars = carsHash.hash;	
	if(cars != undefined) {
		$.each(cars, function(register, car) {
			
			if(filter == 'all' || (filter == 'available' && !car.onRent) || (filter == 'rent' && car.onRent))
				addCarToGrid(car);
		}); 
	}
}

function addCarToGrid(car) {
	$('.no-register').hide();
	var status = car.onRent ? 'Registrar Devolução' : 'Alugar Carro';
	
	var row = "<tr id='row_"+ car.register +"' class='grid-row'>" +
		"<td><p id='model_"+ car.register +"'>"+ car.model +"</p></td>" +
		"<td><p id='year_"+ car.register +"'>"+ car.year +"</p></td>" +
		"<td><p id='reg_"+ car.register +"'>"+ car.register +"</p></td>" +
		"<td><p id='mile_"+ car.register +"'>"+ car.mile +"</p></td>" +
		"<td><span id='rent_"+ car.register +"' name='status' value='"+ car.onRent +"' class='grid-button'>"+ status +"</span></td>" +
		"<td><span id='del_"+ car.register +"' name='delete' class='grid-button fa fa-close'></span></td>" +
	"</tr>";
	
	//Adicionando a linha na grid.
	$('#cars-grid').append(row);
}

function deleteCar(carId) {
	//Remover do Storage.
	carRepository.remove(carId);

	//Removedo a linha referente ao carro selecionado.
	$('#row_'+carId).remove();	
}

function rentCar(carId) {
	hasErrors = false;
	var message = '';
	
	var clientId = $('#sel-rent').val();
	var startMile = $('#mile_'+carId).text();
	var rentDate = getCurrentDate(0);	
	var rentDays = $('#rent-days').val();
	var clientId = $('#sel-rent').val();
	var devolutionDate = getCurrentDate(rentDays);
	
	//Validação:
	if(rentDays <= 0) {
		hasErrors = true;
		message = "O número de dias do aluguel deve ser preenchido.";
	}
	if(clientId <= 0) {
		hasErrors = true;
		message = "O cliente deve ser selecionado.";
	}	
	
	if(hasErrors) {
		$("#rent-message").text(message);
		$("#rent-message").show();
	}
	else {
		var rent = new Rent(carId, clientId, rentDate, devolutionDate, startMile);		
		rentRepository.insert(rent);
		
		carRepository.rent(carId);
		
		var filter = $('.activeFilter').attr('name');
		loadCars(filter);
	}	
}

function returnCar(carId) {
	hasErrors = false;
	var message = '';
	var endMile = $('#return-endMile').val();
	var newestRent;
	
	if(endMile == '') {
		hasErrors = true;
		message = 'A quilometragem final deve ser informada.';
	}
	
	if(hasErrors) {
		$("#return-message").text(message);
		$("#return-message").show();
		$('#return-endMile').focus();
	}
	else {
		var rentHash = rentRepository.getAll();	
		var rents = rentHash.hash;	
		if(rents != undefined) {
			$.each(rents, function(id, rent) {
				if(rent.carId == carId && (rent.endMile == rent.startMile)) {
					newestRent = rent;
				}
			}); 
		}
		
		//Atualizar valores:
		newestRent.__proto__ = Rent.prototype;
		newestRent.setEndMile(endMile);
		rentRepository.insert(newestRent);
		
		carRepository.returnCar(carId, endMile);
		
		var filter = $('.activeFilter').attr('name');
		loadCars(filter);
	}
}

function fillRentDialog(carId) {
	$('#rent-model').text($('#model_'+carId).text());
	$('#rent-year').text($('#year_'+carId).text());
	$('#rent-register').text($('#reg_'+carId).text());
	
	//Adicionando os clientes cadastrados no GOGOBOX !
	var clientRepository = new ClientRepository();
	var clientsHash = clientRepository.getAll();
	var clients = clientsHash.hash;	
	if(clients != undefined) {
		$.each(clients, function(number, client) {
			$('#sel-rent').append("<option value='"+ client.number +"'>"+ client.name +"</option>");			
		}); 
	}	
}

function fillReturnDialog(carId) {
	$('#return-model').text($('#model_'+carId).text());
	$('#return-year').text($('#year_'+carId).text());
	$('#return-register').text($('#reg_'+carId).text());
}

//EVENTOS
$("#confirmation-delete span[name='btn-yes']").click(function () {
	closeModal('#confirmation-delete');
	 
	var carId = currentButtonId.replace('del_','');
	
	deleteCar(carId);	
});

$('#btn-insert-car').click(function () {	
	$('#dialog-validation-info ul li').remove();	
	//Inserindo um novo carro no Storage.
	var model = $('#txt-model').val();
	var year = $('#txt-year').val();
	var register = $('#txt-register').val();
	
	
	var re = /^\d{4}$/;
	var str = {};
	
	if (!re.test(year)){
		str[0] = "O ano precisa conter 4 dígitos";
	}else if (year - 1990 < 0 || year > getCurrentYear() + 1) {
		str[0] = "O ano do carro precisa estar nos limites 1990-2015";
	}
	re = /[A-Z]{3}\d{4}/;
	if (!re.test(register)) {
		str[1]= "A placa precisa conter 3 letras e 4 números";
	}
	
	if (str == {}) {
		var car = new Car(model, year, register);
	
		carRepository.insert(car);
		car = carRepository.get(car.register);
		
		addCarToGrid(car);
		
		$('#txt-model').val('');
		$('#txt-year').val('');
		$('#txt-register').val('');
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
$('#cars-grid').on('click', '.grid-button', function(e) {
	var id = e.target.id;
	var name = $('#'+id).attr('name');
	
	if(name == 'status') {
		var onRent = $('#'+id).attr('value');
		var carId = id.replace('rent_','');
		
		if(onRent == "true")  {				
			//Preenchendo os campos da dialog com as informações do carro.						
			fillReturnDialog(carId);
			openModal('#dialog-return');		
		}
		else {
			//Preenchendo os campos da dialog com as informações do carro.						
			fillRentDialog(carId);
			openModal('#dialog-rent');
		}
	}
	else if (name == 'delete') {
		currentButtonId = e.target.id;
		openModal('#confirmation-delete');
	}	
});

$('.filter-region').on('click', '.button', function(e) {
	var activeId = e.target.id;
	var filter = $('#'+activeId).attr('name');
	
	$('.filter').each( function () {
		$(this).removeClass('activeFilter');
	});
	
	$('#'+activeId).addClass('activeFilter');
	loadCars(filter);
});

$("#dialog-rent span[name='btn-yes']").click( function () {
	var carId = $('#rent-register').text();
	rentCar(carId);
	
	if(!hasErrors) {
		closeModal('#dialog-rent');
		$('#sel-rent').val(0);
		$('#sel-rent-days').val('');
	}
});

$("#dialog-return span[name='btn-yes']").click( function () {
	var carId = $('#return-register').text();
	returnCar(carId);
		
	if(!hasErrors) {
		closeModal('#dialog-return');
		$('#return-endMile').val('');
	}
});