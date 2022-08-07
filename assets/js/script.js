/*
input field for user to enter a city name
button to submit the city name

from https://api.openweathermap.org need to request:
 onecall
*/

//variables:
var cityApiUrl = 'https://api.openweathermap.org/data/3.0/onecall?'

var apiKey = 'de3a3467f61c76a1a478c171e612306e'

var searchButtonEl = document.querySelector("#check-weather");

var cityInputEl = document.querySelector("#city");

var weatherReportContainerEl = document.querySelector("#weather-container");

var forecastReportContainerEl = document.querySelector("#forecast-container");

var weatherRecallContainerEl = document.querySelector("#recall");


var weather = [];
var forecast = [];

//functions:

//handles city input from user then passes to geoposition function to determine lat and lon

var searchWeather = function(event){
    event.preventDefault();
    console.log("button clicked");
    
    var city = cityInputEl.value.trim();
    console.log(city);

    if (city) {
        console.log(city + "if");
        getCityGeoPos(city);
        
    } else {
        alert ("Please enter a city name")
    }

    console.log(event);

}
//fetch city geo position function; finds lat and lon and passes to weather and forecast functions
var getCityGeoPos = function(city){
    var city = cityInputEl.value
    var cityGeoPosApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + "&limit=1&appid=" + apiKey;
     console.log(cityGeoPosApiUrl);

     fetch(cityGeoPosApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                getCityWeather(data);
                              
                
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
    console.log("data passed to weather fn")
    console.log(cityGeoPos[0].lon, cityGeoPos[0].lat);

    var cityLat = cityGeoPos[0].lat;
    var cityLon = cityGeoPos[0].lon;

    var cityWeatherApiUrl = cityApiUrl + 'lat=' + cityLat + '&lon=' + cityLon + '&units=metric&exclude=minutely,hourly,alerts&appid=' + apiKey;
    console.log(cityWeatherApiUrl);

    fetch(cityWeatherApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                displayCityWeatherForecast(data);
                
                
            })
        } else {
            alert("Error: Weather data not found")
        }
     })
     .catch(function(error){
        alert("Unable to connect to OpenWeather")
     })
}


//single function to handle and create elements for weather and forecast data; allows for all relevant data to be packaged as one
var displayCityWeatherForecast = function(cityWeather) {
    console.log(cityWeather, "data passed");
    
    //add code to make sure previously displayed content is removed (for subsequent searches and recalls);

    console.log("remove previous content first")//placeholder

    //package data from fetch(apiUrl) with city name, only need to work off of one data package per city in first search and in recall/loaded data from localstorage;
    var cityWeatherForecast = [];
    var cityName = cityInputEl.value;
    cityWeatherForecast.push(cityName);
    cityWeatherForecast.push(cityWeather);
    localStorage.setItem(cityName, JSON.stringify(cityWeatherForecast));
    console.log(cityWeatherForecast);

    //calls function to create recall button for cityName

    createCityBtn(cityName);//tie button name and property to cityName; use cityName as unique ID for weatherforecast data from local storage
     
    //create city current weather elements

    var cityNameEl = document.createElement("p");
    var city = cityInputEl.value
    var date = moment().format("MM/DD/YY");
    cityNameEl.textContent= city + ' ' + date;
    console.log(cityNameEl);

    var tempEl = document.createElement("p");
    var temp =  cityWeatherForecast.current.temp; 
    tempEl.textContent = 'Temperature: ' + temp + "\u00B0C";
    console.log(tempEl);

    var windEl = document.createElement("p");
    var wind = cityWeatherForecast.current.wind_speed;
    windEl.textContent = 'Wind Speed: ' + wind + "m/s";
    console.log(windEl);

    var humidEl = document.createElement("p");
    var humid =  cityWeatherForecast.current.humidity;
    humidEl.textContent = 'Humidity: ' + humid + "%";
    console.log(humidEl);
    
    var uvEl = document.createElement("p");
    var uv =  cityWeatherForecast.current.uvi;
    uvEl.textContent = 'UV Index: ' + uv;
    console.log(uvEl);
    //control flow for uv value - low to extreme uv
    if (uv<2){
        uvEl.setAttribute("class","low-uv");
        console.log("low-uv")
    } else if (uv>2 && uv<6){
        uvEl.setAttribute("class", "moderate-uv");
        console.log("moderate-uv")
    } else if (uv>5&&uv<8){
        uvEl.setAttribute("class", "high-uv")
        console.log("high-uv")
    } else if(uv>7&&uv<11){
        uvEl.setAttribute("class", "vhigh-uv")
        console.log("vhigh-uv")
    } else {
        uvEl.setAttribute("class", "extreme-uv")
        console.log("extreme-uv")
    }

    //append elements to current weather container 

    weatherReportContainerEl.append(cityNameEl, tempEl, windEl, humidEl, uvEl);

//---------------------------------------------------------------------------------------------------------------------------

    //select out forecast data from cityWeatherForecast array

    console.log(cityWeatherForecast);
    console.log(cityWeatherForecast.daily.slice(0,5));

    var fiveDayForecast = cityWeatherForecast.daily.slice(0,5);
    //loop through array to create elements
    for (var i = 0; i<fiveDayForecast.length; i++){
        
        //create daily forecast container
        forecastContainerEl = document.createElement("div")

        var forecastDate = moment().add(i,"day").format("MM/DD/YY");
        var forecastTemp = fiveDayForecast[i].temp.max;
        var forecastWind = fiveDayForecast[i].wind_speed;
        var forecastHumid = fiveDayForecast[i].humidity;
                
        console.log(forecastDate);
        console.log(forecastTemp);
        console.log(forecastWind);
        console.log(forecastHumid);
        //create daily forecast elements
        var forecastDateEl = document.createElement("p");
        forecastDateEl.textContent = forecastDate

        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = 'Temperature: ' + forecastTemp + '\u00B0C';

        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent= 'Wind Speed: ' + forecastWind + 'm/s';

        var forecastHumidEl = document.createElement("p");
        forecastHumidEl.textContent = 'Humidity: ' + forecastHumid + '%';
        //append elements to daily forecaset container; allows for each daily forecast to be treated as separate columns
        forecastContainerEl.append(forecastDateEl, forecastTempEl, forecastWindEl, forecastHumidEl);
        //append container to document container
        forecastReportContainerEl.appendChild(forecastContainerEl);

        }
    
    //resets cityName input value

    cityInputEl.value = "";

};
    
//create city button
var createCityBtn = function(cityName){
    var cityButtonEl = document.createElement("button");
    cityButtonEl.textContent = cityName;
    console.log(cityButtonEl)
    cityButtonEl.className = "btn edit-btn";

    weatherRecallContainerEl.appendChild(cityButtonEl);
}


//load weather & forecast data when city button clicked, then package into an array
var loadLocalStorage = function(event) {
    event.preventDefault
    
    console.log("button clicked")
    console.log (event)

    var weather = localStorage.getItem(cityName);
    console.log(cityName);
    weather = JSON.parse(cityName);
    console.log(cityName);

    displayLoadedWeatherForecast(cityName);
}
//separate function to display loaded weather & forecast from recall button
var displayLoadedWeatherForecast = function (weatherForecast) {
    console.log(weatherForecast, "passed data");

}

//event listeners:

weatherRecallContainerEl.addEventListener("click", loadLocalStorage);
searchButtonEl.addEventListener("click", searchWeather);