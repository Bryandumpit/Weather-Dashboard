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

var forecastHeaderContainerEl = document.querySelector("#forecast-header");

var forecastReportContainerEl = document.querySelector("#forecast-container");

var weatherRecallContainerEl = document.querySelector("#recall");

var recallHeaderContainerEl = document.querySelector("#recall-header")

//functions:

//handles city input from user then passes to geoposition function to determine lat and lon

var searchWeather = function(event){
    event.preventDefault();
    
    
    var city = cityInputEl.value.trim();
   

    if (city) {
        
        getCityGeoPos(city);
        
    } else {
        alert ("Please enter a city name")
    }

    

}
//fetch city geo position function; finds lat and lon and passes to weather and forecast functions
var getCityGeoPos = function(city){
    var city = cityInputEl.value
    var cityGeoPosApiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + "&limit=1&appid=" + apiKey;
     

     fetch(cityGeoPosApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                
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
    

    var cityLat = cityGeoPos[0].lat;
    var cityLon = cityGeoPos[0].lon;

    var cityWeatherApiUrl = cityApiUrl + 'lat=' + cityLat + '&lon=' + cityLon + '&units=metric&exclude=minutely,hourly,alerts&appid=' + apiKey;
    

    fetch(cityWeatherApiUrl)
     .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                
                cityDataHandler(data);
                
                
            })
        } else {
            alert("Error: Weather data not found")
        }
     })
     .catch(function(error){
        alert("Unable to connect to OpenWeather")
     })
}

var cityDataHandler = function(cityWeather){
    
    
    //package data from fetch(apiUrl) with city name, only need to work off of one data package per city in first search and in recall/loaded data from localstorage;
    //index [0] would contain the city name searched and index [1] would contain the data fetched
    var cityWeatherForecast = [];
    var cityName = cityInputEl.value;
    cityWeatherForecast.push(cityName);
    cityWeatherForecast.push(cityWeather);
    localStorage.setItem(cityName, JSON.stringify(cityWeatherForecast));
    

    //calls function to create recall button for cityName

    createCityBtn(cityName);//tie button name and property to cityName; use cityName as unique ID for weatherforecast data from local storage

    displayCityWeatherForecast(cityWeatherForecast);
}

//single function to handle and create elements for weather and forecast data; allows for all relevant data to be packaged as one
var displayCityWeatherForecast = function(cityWeather) {
    
    //add code to make sure previously displayed content is removed (for subsequent searches and recalls);
    weatherReportContainerEl.replaceChildren();
    forecastReportContainerEl.replaceChildren();
    forecastHeaderContainerEl.replaceChildren();

    
//--------------Current Weather Data Handling-----------------------------------   
    //create city current weather elements

    var cityWeatherForecast=cityWeather;

    var weatherIcon = cityWeather[1].current.weather[0].icon;
    var weatherIconEl = document.createElement("img")
    weatherIconEl.src= 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png'
    weatherIconEl.alt= 'weather_icon'
    

    var cityContainerEl = document.createElement("div");
    cityContainerEl.setAttribute("class","d-flex flex-row flex-wrap align-items-center justify-content-around")
    var cityNameEl = document.createElement("h2")
    var city = cityWeather[0]
    var date = moment().format("MM/DD/YY");
    cityNameEl.textContent= city + ' ' + date;
    cityContainerEl.append(cityNameEl, weatherIconEl);
    

    var tempEl = document.createElement("p");
    var currentTemp =  cityWeatherForecast[1].current.temp; 
    tempEl.innerHTML = '<p class="fw-bold">Temperature: <span class="fw-light">' + currentTemp + '\u00B0C</span></p>'
    

    var windEl = document.createElement("p");
    var currentWind = cityWeatherForecast[1].current.wind_speed;
    windEl.innerHTML = '<p class="fw-bold">Wind Speed: <span class="fw-light">' + currentWind + 'm/s</span></p>'
    

    var humidEl = document.createElement("p");
    var currentHumid =  cityWeatherForecast[1].current.humidity;
    humidEl.innerHTML = '<p class="fw-bold">Humidity: <span class="fw-light">' + currentHumid + '%</span></p>'
    
    
    var uvEl = document.createElement("p");
    var currentUv =  cityWeatherForecast[1].current.uvi;
    var uvRating='';
    //control flow for uv value - low to extreme uv
    if (currentUv<3){//0-2 uv low                       
        uvRating = 'low-uv';
       
    } else if (currentUv>2 && currentUv<6){//3-5 uv moderate
        uvRating = 'moderate-uv';
        
    } else if (currentUv>5&&currentUv<8){//6-7 uv high
        uvRating = 'high-uv';
        
    } else if(currentUv>7&&currentUv<11){//8-10 uv vhigh
        uvRating = 'vhigh-uv';
        
    } else {//11+  uv extreme
        uvRating = 'extreme-uv';
        
    }
    uvEl.innerHTML = '<p class="fw-bold"> UV Index: <span class="fw-light ' + uvRating + '">' + currentUv + '<span>';
    
    

    //append elements to current weather container 

    weatherReportContainerEl.append(cityContainerEl, tempEl, windEl, humidEl, uvEl);

//----------------------------Forecast Data Handling---------------------------------

    // //create forecast header

    var forecastHeader = document.createElement("h2");
    forecastHeader.textContent = "5-Day Forecast:"
    forecastHeaderContainerEl.appendChild(forecastHeader);

    //select out forecast data from cityWeatherForecast array
    

    var fiveDayForecast = cityWeatherForecast[1].daily.slice(0,5);
    //loop through array to create elements
    for (var i = 0; i<fiveDayForecast.length; i++){
        
        //create daily forecast container
        var forecastContainerEl = document.createElement("div")
        forecastContainerEl.setAttribute("class", "forecast-card m-2 d-flex flex-column flex-wrap col-lg-2 col-md-8 xol-sm-12")
        
        var forecastDateIconEl = document.createElement("div")
        var forecastDate = moment().add(i,"day").format("MM/DD/YY");
        var forecastDateEl = document.createElement("h3")
        forecastDateEl.textContent=forecastDate;
        var forecastIcon = fiveDayForecast[i].weather[0].icon
        var forecastIconEl = document.createElement("img")
        forecastIconEl.src = 'http://openweathermap.org/img/wn/' + forecastIcon + '@2x.png'
        forecastDateIconEl.append(forecastDateEl, forecastIconEl);

        var forecastTemp = fiveDayForecast[i].temp.max;
        var forecastWind = fiveDayForecast[i].wind_speed;
        var forecastHumid = fiveDayForecast[i].humidity;
                
        //create daily forecast elements
        

        var forecastTempEl = document.createElement("p");
        forecastTempEl.setAttribute("class", "text-start")
        forecastTempEl.textContent = 'Temperature: ' + forecastTemp + '\u00B0C';

        var forecastWindEl = document.createElement("p");
        forecastWindEl.setAttribute("class", "text-start")
        forecastWindEl.textContent= 'Wind Speed: ' + forecastWind + 'm/s';

        var forecastHumidEl = document.createElement("p");
        forecastHumidEl.setAttribute("class", "text-start")
        forecastHumidEl.textContent = 'Humidity: ' + forecastHumid + '%';
        //append elements to daily forecaset container; allows for each daily forecast to be treated as separate columns
        forecastContainerEl.append(forecastDateIconEl, forecastTempEl, forecastWindEl, forecastHumidEl);
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
    cityButtonEl.className = "btn btn-secondary btn-sm m-1 col-4";
    cityButtonEl.setAttribute("id", cityName)

    weatherRecallContainerEl.appendChild(cityButtonEl);
}


//load weather & forecast data when city button clicked, then package into an array
var loadLocalStorage = function(event) {
    event.preventDefault

    var city = event.target.getAttribute("id")
    
    var loadedWeatherForecast = localStorage.getItem(city);
    weatherForecast = JSON.parse(loadedWeatherForecast);

    displayCityWeatherForecast(weatherForecast);//sends loaded data to function creating elements and attaching to DOM
}


//event listeners:

weatherRecallContainerEl.addEventListener("click", loadLocalStorage);
searchButtonEl.addEventListener("click", searchWeather);