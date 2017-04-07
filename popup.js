$(document).ready(function(){
	
	var API_KEY = "6024458a4f024f503e13a1c35b7c409f"
	var cities = [];
	
	function clearCityList(){
		if($('#citylist').children().length>0){
			$('#citylist').empty();
		}
	}
	
	function saveChanges() {
		chrome.storage.local.set({'userCities':cities},function() {
			console.log("settings saved");
		});
	}
	
	function isValidCity(cityName){
		
		var isValid;
		var xhttp = new XMLHttpRequest();
		
		var url = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID="+API_KEY;
		console.log(url);
		xhttp.onreadystatechange = function() {
			if(xhttp.readyState == 4)
			{
				if(xhttp.status == 400 || xhttp.status == 404){
					isValid = false;
				} else if (xhttp.status == 200) {
					isValid = true;
				}
			}
			
		}
		
		xhttp.open("GET",url,false);
		xhttp.send();
		return isValid;
			
	}
	
	
	function getCities() {
		clearCityList();
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
						

						
						$("#citylist").append('<div>'+currentcity+'-'+description+'</div><img src="'+imgsrc+'"/><input type="button" id="rmel" value="remove" >');


					}
				}
						
				xhttp.open("GET",url,false);
				xhttp.send();
	
			}
		});
	}
	
	getCities();
	
	
	$("#button").click(function() {

		var city = $("#field").val();

		if (isValidCity(city)) {
			cities.push(city);
			saveChanges();
			getCities();
		} else {
			$("#field").val("INVALID CITY!");
		}
		
	});
	
	$("#citylist").on('click','#rmel',function() {
		var c = $(this).prev().prev().html();
		var cityRemoved = c.split("-")[0];
		console.log(cityRemoved);
		var index = cities.indexOf(cityRemoved);
		if(index > -1) {
			cities.splice(index,1);
		}
		saveChanges();
		getCities();
		
	});
	

	
	
	
});