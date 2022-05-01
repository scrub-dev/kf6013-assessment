const weatherEndpoint = "/utils/weather.php" //Local endpoint so UID is hidden

//JQuery function for getting the weather data
const getWeather = location => {
  $.getJSON(weatherEndpoint 
            + `?lat=${location.lat}`
            + `&lng=${location.lng}`,
            res => {
              parseWeatherData(res, location)
            }
  )
}

//Parsing weather data into either an error or generating the weather widget
const parseWeatherData = (weather, location) => {
  if(weather.status !== undefined){
    $("#weatherWidget").html(`<li><a>No Weather data for this location</a></li>`)
  }else{
    $("#weatherWidget").html(generateWeatherWidget(weather.weatherObservation, location))
  }
}

//converts weather data into human readable widgets in a list.
const generateWeatherWidget = (weather, location) => {
  const PREFIX = "ww"
  return `
  <li><a id="${PREFIX}clouds">Clouds: ${weather.clouds}</a></li>
  <li><a id="${PREFIX}humidity">Humidity: ${weather.humidity}%</a></li>
  <li><a id="${PREFIX}temp">Temp: ${weather.temperature} c</a></li>
  <li><a id="${PREFIX}name">${location.name}</a></li>
  `
}

//When document first loads, get default location
$(document).ready( ()=> {
  getWeather(getDefaultLocation())
})