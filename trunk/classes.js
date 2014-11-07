//CARRO
var Car = function(model, year, register) {
	this.setModel(model);
	this.setYear(year);
	this.setRegister(register);
	this.setMile(0);
	this.setOnRent(false);
}	

Car.prototype.setModel = function(model) {
	this.model = model;
}
Car.prototype.setYear = function(year) {
	this.year = year;
}
Car.prototype.setRegister = function(register) {
	this.register = register;
}
Car.prototype.setMile = function(mile) {
	this.mile = mile;
}
Car.prototype.setOnRent = function(onRent) {
	this.onRent = onRent;
}

//REPOSITÓRIO DE CARROS
var CarRepository = function() {
	this.storage = new Storage();
	this.key = 'cars';
}
CarRepository.prototype.get = function(carId) {
	var cars = this.getAll();
	var car = cars.get(carId);
	car.__proto__ = Car.prototype;
	
	return car;
}
CarRepository.prototype.getAll = function() {
	var cars = this.storage.getObject(this.key);
	
	if(cars != undefined)
		cars.__proto__ = HashMap.prototype;
	else
		cars = new HashMap();
	
	return cars;
}
CarRepository.prototype.insert = function(car) {	
	var cars = this.getAll();			
	
	cars.add(car.register, car);
	this.storage.setObject(this.key, cars);	
}
CarRepository.prototype.remove = function(carId) {
	var cars = this.getAll();
	cars.remove(carId);
	this.storage.setObject(this.key, cars);
}
CarRepository.prototype.clear = function() {
	this.storage.removeObject(this.key);
}
CarRepository.prototype.rent = function(carId) {
	var car = this.get(carId);
	car.setOnRent(true);
	this.insert(car);
}
CarRepository.prototype.returnCar = function(carId, mile) {
	var car = this.get(carId);
	car.setMile(mile);
	car.setOnRent(false);
	this.insert(car);
}
CarRepository.prototype.getBackup = function() {
	return this.storage.getBackup(this.key);
}

//CATEGORIA DE CARRO
var Category = function(model, image) {
	this.setModel(model);
	this.setImage(image);
	this.setInfo('');
}
Category.prototype.setModel = function(model) {
	this.model = model;
}
Category.prototype.setImage = function(image) {
	this.image = image;
}
Category.prototype.setInfo = function(info) {
	this.info = info;
}

//REPOSITÓRIO DE CATEGORIA
var CategoryRepository = function() {
	this.storage = new Storage();
	this.key = 'categories';
}
CategoryRepository.prototype.get = function(model) {
	var categories = this.getAll();
	var category = categories.get(model);
	
	if(category != undefined)
		category.__proto__ = Category.prototype;
	
	return category;
}
CategoryRepository.prototype.getAll = function() {
	var categories = this.storage.getObject(this.key);
	
	if(categories != undefined)
		categories.__proto__ = HashMap.prototype;
	else
		categories = new HashMap();
	
	return categories;
}
CategoryRepository.prototype.insert = function(category) {	
	var categories = this.getAll();			
	
	categories.add(category.model, category);
	this.storage.setObject(this.key, categories);	
}
CategoryRepository.prototype.remove = function(model) {
	var categories = this.getAll();
	categories.remove(model);
	this.storage.setObject(this.key, categories);
}
CategoryRepository.prototype.getBackup = function() {
	return this.storage.getBackup(this.key);
}

//CLIENTE
var Client = function(name, number, cnh) {
	this.setName(name);         
	this.setNumber(number);   
	this.setCNH(cnh); 	
}
Client.prototype.setName = function(name) {
	this.name = name;
},
Client.prototype.setNumber =function(number) {
	this.number = number;
}
Client.prototype.setCNH =function(cnh) {
	this.cnh = cnh;
}

var ClientRepository = function() {	
	this.storage = new Storage();
	this.key = 'clients';
}
ClientRepository.prototype.get = function(clientId) {
	var clients = this.getAll();
	var client = clients.get(clientId);
	client.__proto__ = Client.prototype;
	
	return client;
}
ClientRepository.prototype.getAll =function() {
	var clients = this.storage.getObject(this.key);
	
	if(clients != undefined)
		clients.__proto__ = HashMap.prototype;
	else
		clients = new HashMap();
	
	return clients;
}
ClientRepository.prototype.insert = function(client) {
	var clients = this.getAll();			
	
	clients.add(client.number, client);
	this.storage.setObject(this.key, clients);
}
ClientRepository.prototype.remove = function(clientId) {
	var clients = this.getAll();
	clients.remove(clientId);
	this.storage.setObject(this.key, clients);
}
ClientRepository.prototype.clear = function() {
	this.storage.removeObject(this.key);
}
ClientRepository.prototype.getBackup = function() {
	return this.storage.getBackup(this.key);
}

//ALUGUEL
var Rent = function(carId, clientId, rentDate, devolutionDate, startMile) {
	this.setCarId(carId);         
	this.setClientId(clientId);         
	this.setRentDate(rentDate);  
	this.setDevolutionDate(devolutionDate);
	this.setStartMile(startMile);
	this.setEndMile(startMile);
}
Rent.prototype.setCarId = function(carId) {
	this.carId = carId;
}
Rent.prototype.setClientId = function(clientId) {
	this.clientId = clientId;
}
Rent.prototype.setRentDate = function(rentDate) {
	this.rentDate = rentDate;
}
Rent.prototype.setDevolutionDate = function(devolutionDate) {
	this.devolutionDate = devolutionDate;
}
Rent.prototype.setStartMile = function(startMile) {
	this.startMile = startMile;
}
Rent.prototype.setEndMile = function(endMile) {
	this.endMile = endMile;
}

var RentRepository = function(){
	this.storage = new Storage();
	this.key = 'rents';
}
RentRepository.prototype.get = function(rentId) {
	var rents = this.getAll();
	var rent = rents.get(rentId);
	rent.__proto__ = Rent.prototype;
	
	return rent;
}
RentRepository.prototype.getAll = function() {
	var rents = this.storage.getObject(this.key);
	
	if(rents != undefined)
		rents.__proto__ = HashMap.prototype;
	else
		rents = new HashMap();
	
	return rents;
}
RentRepository.prototype.insert = function(rent) {
	var rents = this.getAll();			
	var rentId = rent.carId+"_"+rent.clientId;
	rents.add(rentId, rent);
	this.storage.setObject(this.key, rents);
}
RentRepository.prototype.remove = function(rentId) {
	var rents = this.getAll();
	rents.remove(rentId);
	this.storage.setObject(this.key, rents);
}
RentRepository.prototype.clear = function() {
	this.storage.removeObject(this.key);
}
RentRepository.prototype.getBackup = function() {
	return this.storage.getBackup(this.key);
}

//ARMAZENAMENTO
var Storage = function() {}
Storage.prototype.setObject = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = localStorage.getItem(key);

    return value && JSON.parse(value);
}
Storage.prototype.removeObject = function(key) {
    localStorage.removeItem(key);
}
Storage.prototype.getBackup = function(key) {
    return localStorage.getItem(key);
}

//HASH MAP
var HashMap = function() {
	this.hash = {};
}
HashMap.prototype.add = function(key, value) {
	this.hash[key] = value;
}
HashMap.prototype.remove = function(key) {
	delete this.hash[key];
}
HashMap.prototype.get = function(key) {
	return this.hash[key];
}
HashMap.prototype.contains = function(key) {
	return (key in this.hash);
}
