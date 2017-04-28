$(document).ready(function(){
	
	var API_KEY = "6024458a4f024f503e13a1c35b7c409f"
	var cities = [];
	
	function cel2fahr(c){
		var f = Math.round(c * 9 / 5 + 32);
		return f;
	}
	
	function fahr2cel(f){
		var c = Math.round((f - 32) * 5 / 9);
		return c;
	}
	
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
				} else if (xhttp.status == 200) {
					var data = JSON.parse(xhttp.response);
					var cityName = data.name;
					isValid = cityName;
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

				
				
				var xhttp = new XMLHttpRequest();
				var tempUnit = "imperial";
				if ($('#tempConvert').val() == "fahrenheit"){
					tempUnit = "metric";
				}
				var url = "http://api.openweathermap.org/data/2.5/weather?q="+cities[i]+"&APPID="+API_KEY+"&units="+tempUnit;
				xhttp.onreadystatechange = function(){

					if(xhttp.readyState == 4 && xhttp.status == 200){
						data = JSON.parse(xhttp.response);
						var description = data.weather[0].description;
						var tempMin = Math.ceil(data.main.temp_min);
						var tempMax = Math.ceil(data.main.temp_max);
						var imgsrc = "http://openweathermap.org/img/w/"+data.weather[0].icon+'.png';
						var cityName = data.name;

						$("#citylist").append(
						'<div id = "cityBlock">\
							<span id ="rmel" {cursor:pointer}>&#10006</span>\
							<img id = "weatherIcon" src="'+imgsrc+'"/> \
							<div id="name">'+cityName+'</div> \
							<div class="temp">'+tempMin+'|'+tempMax+'</div>\
						<div id="info" >'+description+'</div> \
						 \
						</div>');


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
		var toBeAdded = isValidCity(city);
		if (toBeAdded) {
			cities.push(toBeAdded);
			saveChanges();
			getCities();
		} else {
			$("#field").val("INVALID CITY");

		}
		
	});
	
	$("#citylist").on('click','#rmel',function() {
		var cityRemoved = $(this).prev().prev().prev().prev().html();
		//var cityRemoved = c.split("-")[0];
		console.log(cityRemoved);
		var index = cities.indexOf(cityRemoved);
		if(index > -1) {
		}
			cities.splice(index,1);
		saveChanges();
		getCities();
		
	});
	
	
	
	$("#tempConvert").click(function() {

				var unit = $(this).val();
				if(unit == "celsius")
				{
					$(".temp").each(function() {
						//grab min and max values by splitting

						var newMin = $(this).text().split("|")[0];
						var newMax = $(this).text().split("|")[1];

						var cMin = fahr2cel(newMin);
						var cMax = fahr2cel(newMax);
						$(this).text(cMin +"|"+cMax);
					});
					$(this).val("fahrenheit");
				} else{
					$(".temp").each(function() {
						//grab min and max values by splitting

						var newMin = $(this).text().split("|")[0];
						var newMax = $(this).text().split("|")[1];

						var fMin = cel2fahr(newMin);
						var fMax = cel2fahr(newMax);
						$(this).text(fMin +"|"+fMax);
					});
					$(this).val("celsius");
		
			}
 

	});
		
		
		
	
	
	
});