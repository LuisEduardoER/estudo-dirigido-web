var map;
var directionsDisplay; // Instanciaremos ele mais tarde, que será o nosso google.maps.DirectionsRenderer
var directionsService = new google.maps.DirectionsService();
var endAdress;
var geocoder;
 
 $(document).ready(function () {
	initialize();
	
	geocoder = new google.maps.Geocoder();
	//Endereço final: Líbero
	endAdress = new google.maps.LatLng(-8.131616, -34.915890);
	
	geocoder.geocode({ 
		 "location": endAdress
	  },
		function(results, status) {
		 if (status == google.maps.GeocoderStatus.OK) {
			console.log(results);
			$('#end-adress').text(results[0].formatted_address);
		}
	});
});
 
function initialize() {
   directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando...
   var latlng;
   // Se o navegador do usuário tem suporte ao Geolocation
   if (navigator.geolocation) {
		
	   navigator.geolocation.getCurrentPosition(function (position) {
		//Endereço inicial: Posição do usuário.
		  latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // Com a latitude e longitude que retornam do Geolocation, criamos um LatLng
		  map.setCenter(latlng);
	   		  	  
		  geocoder.geocode({ // Usando nosso velho amigo geocoder, passamos a latitude e longitude do geolocation, para pegarmos o endereço em formato de string
			 "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
		  },
		  function(results, status) {
			 if (status == google.maps.GeocoderStatus.OK) {
				createRoute(latlng);
			 }
		  });
	   });
	}
 
   var options = {
      zoom: 13,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
 
   map = new google.maps.Map(document.getElementById("googleMap"), options);
   directionsDisplay.setMap(map);
}
 
function createRoute(startAdress) {
   var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
      origin: startAdress, // origem
      destination: endAdress, // destino
      travelMode: google.maps.TravelMode.DRIVING, // meio de transporte, nesse caso, de carro
   };
 
   directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
         directionsDisplay.setDirections(result); // Renderizamos no mapa o resultado
		 map.setZoom(13);
      }
   });
}