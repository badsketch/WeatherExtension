$(document).ready(function(){
	
	var API_KEY = "6024458a4f024f503e13a1c35b7c409f"
	var cities = [];
	

	function getCities() {
		if($('#citylist').children().length>0){
			$('#citylist').empty();
		}
		chrome.storage.local.get('userCities', function(data) {
			cities = data.userCities;

			
			for(var i = 0;i<cities.length;i++){

				var currentcity = cities[i];
				
				
				var xhttp = new XMLHttpRequest();

				var url = "http://api.openweathermap.org/data/2.5/weather?q="+cities[i]+"&APPID="+API_KEY;
				xhttp.onreadystatechange = function(){
					if(xhttp.readyState == 4 && xhttp.status == 200){

						data = JSON.parse(xhttp.response);
						var description = data.weather[0].description;
						var imgsrc = "http://openweathermap.org/img/w/"+data.weather[0].icon+'.png';
						

						
						$("#citylist").append('<div>'+currentcity+'-'+description+'</div><img src="'+imgsrc+'"/>');


					}
				}
						
				
				
				
				xhttp.open("GET",url,false);
				xhttp.send();
			

					
				
			}
		});
	}
	
	getCities();
	
	function saveChanges() {
		chrome.storage.local.set({'userCities':cities},function() {
			console.log("settings saved");
		});
	}
	
	$("#button").click(function() {
		
		
		var city = $("#field").val();
		cities.push(city);
		saveChanges();
		getCities();
		
		

		


	
	});
	
	
	
	
	
});