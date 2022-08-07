/*
input field for user to enter a city name
button to submit the city name

from https://api.openweathermap.org need to request:
 CurrentWeatherData, 5Day Forecast and UV Index, direct geocoding
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
                displayCityWeather(data);
                displayCityForecast(data);
                
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
     
    //create element
    //set content
    //append to container
    //append to page

    var cityNameEl = document.createElement("p");
    var city = cityInputEl.value
    var date = moment().format("MM/DD/YY");
    cityNameEl.textContent= city + ' ' + date;//add current date via moment.js
    console.log(cityNameEl);

    var tempEl = document.createElement("p");
    var temp =  cityWeather.current.temp; 
    tempEl.textContent = 'Temperature: ' + temp + "\u00B0C";
    console.log(tempEl);

    var windEl = document.createElement("p");
    var wind = cityWeather.current.wind_speed;
    windEl.textContent = 'Wind Speed: ' + wind + "m/s";
    console.log(windEl);

    var humidEl = document.createElement("p");
    var humid =  cityWeather.current.humidity;
    humidEl.textContent = 'Humidity: ' + humid + "%";
    console.log(humidEl);
    
    var uvEl = document.createElement("p");
    var uv =  cityWeather.current.uvi;
    uvEl.textContent = 'UV Index: ' + uv;
    console.log(uvEl);
    if (uv<2){
        uvEl.setAttribute("class","low-uv");
        console.log("low-uv")
    } else if (uv>2 && uv<5){
        uvEl.setAttribute("class", "moderate-uv");
        console.log("moderate-uv")
    } else if (uv>5&&uv<7){
        uvEl.setAttribute("class", "high-uv")
        console.log("high-uv")
    } else if(uv>7&&uv<9){
        uvEl.setAttribute("class", "vhigh-uv")
        console.log("vhigh-uv")
    } else {
        uvEl.setAttribute("class", "extreme-uv")
        console.log("extreme-uv")
    }

    var weatherObj = {
        name: cityInputEl.value,
        currentTemp: temp,
        currentWind: wind,
        currentHumid: humid,
        currentUv: uv,
    }

    weatherArrayHandler(weatherObj);

    createCityBtn(city);

    weatherReportContainerEl.append(cityNameEl, tempEl, windEl, humidEl, uvEl);
}

var displayCityForecast = function(cityForecast) {
    console.log(cityForecast);
    console.log(cityForecast.daily.slice(0,5));
    
    var fiveDayForecast = cityForecast.daily.slice(0,5);

    var pushedForecastObj =[];

    for (var i = 0; i<fiveDayForecast.length; i++){
        

        //create forecast container div, append forecast data to forecast container div
        //append forecast container div to corresponding container in DOM 
        //need date, temp, wind, humidity

        forecastContainerEl = document.createElement("div")

        var date = moment().add(i,"day").format("MM/DD/YY");
        var forecastTemp = fiveDayForecast[i].temp.max;
        var forecastWind = fiveDayForecast[i].wind_speed;
        var forecastHumid = fiveDayForecast[i].humidity;
                
        console.log(date);
        console.log(forecastTemp);
        console.log(forecastWind);
        console.log(forecastHumid);

        var dateEl = document.createElement("p");
        dateEl.textContent = date

        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = 'Temperature: ' + forecastTemp + '\u00B0C';

        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent= 'Wind Speed: ' + forecastWind + 'm/s';

        var forecastHumidEl = document.createElement("p");
        forecastHumidEl.textContent = 'Humidity: ' + forecastHumid + '%';
        
        forecastContainerEl.append(dateEl, forecastTempEl, forecastWindEl, forecastHumidEl);

        forecastReportContainerEl.appendChild(forecastContainerEl);

        var forecastObj ={
            dt: date,
            temp: forecastTemp,
            wind: forecastWind,
            humid: forecastHumid,
        }

        pushedForecastObj.push(forecastObj);

        
    }
    forecastArrayHandler(pushedForecastObj);
    cityInputEl.value = "";
    

}

//create city button
var createCityBtn = function(cityName){
    var cityButtonEl = document.createElement("button");
    cityButtonEl.textContent = cityName;
    console.log(cityButtonEl)
    cityButtonEl.className = "btn edit-btn";

    weatherRecallContainerEl.appendChild(cityButtonEl);
}



//put weather ans forecast data to local storage 

var weatherArrayHandler = function(weatherObj) {
    console.log(weatherObj);
    weather.push(weatherObj);
    console.log(weather);
    localStorage.setItem("weather", JSON.stringify(weather));
    
}

var forecastArrayHandler = function(forecastObj){
    console.log(forecastObj);
    forecast.push(forecastObj);
    console.log(forecast);
    localStorage.setItem("forecast", JSON.stringify(forecast))
}

//load weather & forecast data when city button clicked, then package into an array
var loadLocalStorage = function(event) {
    event.preventDefault
    
    console.log("button clicked")
    console.log (event)

    var weather = localStorage.getItem("weather");
    console.log(weather);
    weather = JSON.parse(weather);
    console.log(weather);


    var forecast = localStorage.getItem("forecast");
    console.log(forecast);
    forecast=JSON.parse(forecast);
    console.log(forecast);

    var weatherForecast = [];
    weatherForecast.push(weather);
    weatherForecast.push(forecast);

    displayLoadedWeatherForecast(weatherForecast);
}
//separate function to display loaded weather & forecast from recall button
var displayLoadedWeatherForecast = function (weatherForecast) {
    console.log(weatherForecast, "passed data");

    var cityName = weatherForecast[0].name
    var cityNameEl = document.createElement("p")
    var currentDate = moment().format("MM/DD/YY");
    cityNameEl.textContent= cityName + ' ' + currentDate;
    console.log(cityNameEl);

    





}



//event listeners:

weatherRecallContainerEl.addEventListener("click", loadLocalStorage);
searchButtonEl.addEventListener("click", searchWeather);
