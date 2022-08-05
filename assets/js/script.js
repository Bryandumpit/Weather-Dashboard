/*
input field for user to enter a city name
button to submit the city name

from https://api.openweathermap.org need to request:
 CurrentWeatherData, 5Day Forecast and UV Index, direct geocoding
*/
var cityApiUrl = 'http://api.openweathermap.org/'

var apiKey = '41fd2eedaf347c05f695ec707c59c98c'

var searchButtonEl = document.querySelector("#check-weather");

var cityInputEl = document.querySelector("#city");

var searchWeather = function(event){
    event.preventDefault();
    console.log("button clicked");
    
    var city = cityInputEl.value.trim();
    console.log(city);

    if (city) {
        console.log(city + "if");//call fetch function
        getCityGeoPos(city);
        cityInputEl.value = "";
    } else {
        alert ("Please enter a city name")
    }

    console.log(event);

}
//fetch city geo position function
var getCityGeoPos = function(city){
    var city = cityInputEl.value
    var cityGeoPosApiUrl = cityApiUrl + 'geo/1.0/direct?q=' + city + "&limit=1&appid=" + apiKey;
     console.log(cityGeoPosApiUrl);

     fetch(cityGeoPosApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                getCityWeather (data);
                
            })
        } else {
            alert("Error: City not found")
        }
     })
     .catch(function(error){
        alert("Unable to connect to OpenWeather")
     })
}
//fetch city weather function
var getCityWeather = function (cityGeoPos) {
    console.log("data passed to function")
    console.log(cityGeoPos[0].lon, cityGeoPos[0].lat);

    var cityLat = cityGeoPos[0].lat;
    var cityLon = cityGeoPos[0].lon;

    var cityWeatherApiUrl = cityApiUrl + 'data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=metric&appid=' + apiKey;
    console.log(cityWeatherApiUrl);

    fetch(cityWeatherApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                displayCityWeather(data);
                
            })
        } else {
            alert("Error: Weather data not found")
        }
     })
     .catch(function(error){
        alert("Unable to connect to OpenWeather")
     })
}

var displayCityWeather = function(cityWeather) {
    console.log(cityWeather, "data passed");

    console.log(cityWeather.name);
    console.log(cityWeather.main.temp + "degC");
    console.log(cityWeather.main.humidity + "%");
    console.log(cityWeather.wind.speed + "m/s");

    //create element
    //set content
    //append to container
    //append to page

}


searchButtonEl.addEventListener("click", searchWeather);
