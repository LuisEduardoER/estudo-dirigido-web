var currentButtonId;
var carRepository;

$(document).ready(function () {	
	carRepository = new CarRepository();
	
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
	var status = car.onRent ? 'Registrar Devolucao' : 'Alugar Carro';
	
	var row = "<tr id='row_"+ car.register +"' class='grid-row'>" +
		"<td><p>"+ car.model +"</p></td>" +
		"<td><p>"+ car.year +"</p></td>" +
		"<td><p>"+ car.register +"</p></td>" +
		"<td><p>"+ car.mile +" Km</p></td>" +
		"<td><span id='rent_"+ car.register +"' name='status' value='"+ car.onRent +"' class='grid-button'>"+ status +"</span></td>" +
		"<td><span id='del_"+ car.register +"' name='delete' class='grid-button'>X</span></td>" +
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
	console.log('Alugar carro: '+ carId);
}

function returnCar(carId) {
	console.log('Devolver carro: '+ carId);
}

//EVENTOS
$('#btn-yes').click(function () {
	closeModal('#confirmation-delete');
	 
	var carId = currentButtonId.replace('del_','');
	
	deleteCar(carId);	
});

$('#btn-insert-car').click(function () {	
	//Inserindo um novo carro no Storage.
	var model = $('#txt-model').val();
	var year = $('#txt-year').val();
	var register = $('#txt-register').val();

	var car = new Car(model, year, register);
	
	carRepository.insert(car);
	car = carRepository.get(car.register);
	
	addCarToGrid(car);
	
	$('#txt-model').val('');
	$('#txt-year').val('');
	$('#txt-register').val('');
});

// Disparado quando algum botão da grid for pressionado.
$('#cars-grid').on('click', '.grid-button', function(e) {
	var id = e.target.id;
	var name = $('#'+id).attr('name');
	
	if(name == 'status') {
		var onRent = $('#'+id).attr('value');
		var carId = id.replace('rent_','');
		
		if(onRent == true) 
			returnCar(carId);
		else
			rentCar(carId);
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
