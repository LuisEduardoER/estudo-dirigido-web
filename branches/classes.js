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
CarRepository.prototype.clear = function(key) {
	this.storage.removeObject(this.key);
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
ClientRepository.prototype.clear = function(key) {
	this.storage.removeObject(this.key);
}

//ALUGUEL
var Rent = function(carId, clientId, rentDate, devolutionDate, startMile, endMile) {
	this.setCarId(carId);         
	this.setClientId(clientId);         
	this.setRentDate(rentDate);  
	this.setDevolutionDate(devolutionDate);
	this.setStartMile(startMile);		
	this.setEndMile(endMile);
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
}
RentRepository.prototype.get = function(rentId) {
}
RentRepository.prototype.getAll = function() {
}
RentRepository.prototype.insert = function(rent) {
}
RentRepository.prototype.update = function(rent) {
}
RentRepository.prototype.remove = function(rentId) {
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
