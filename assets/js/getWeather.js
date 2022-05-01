//Sustainable NE HQ LAT/LNG
const DEFAULT_LOCATION = { //Default location
  lat: 54.977399,
  lng: -1.6079944
}

const weatherEndpoint = "/utils/weather.php" //Local endpoint so UID is hidden

//JQuery function for getting the weather data
const getWeather = location => {
  $.getJSON(weatherEndpoint 
            + `?lat=${location.lat}`
            + `&lng=${location.lng}`,
            res => {
              parseWeatherData(res)
            }
  )
}

//Parsing weather data into either an error or generating the weather widget
const parseWeatherData = weather => {
  if(weather.status !== undefined){
    $("#weatherWidget").html(`<li>${capitalizeFirstChar(weather.status)}</li>`)
  }else{
    $("#weatherWidget").html(generateWeatherWidget(weather.weatherObservation))
  }
}

//converts weather data into human readable widgets in a list.
const generateWeatherWidget = weather => {
  const PREFIX = "ww"
  return `
  <li><a id=${PREFIX}clouds>Clouds: ${weather.clouds}</a></li>
  <li><a id=${PREFIX}humidity>Humidity: ${weather.humidity}</a></li>
  <li><a id=${PREFIX}temp>Temp: ${weather.temperature}</a></li>
  `
}

//When document first loads, get default location
$(document).ready( ()=> {
  getWeather(DEFAULT_LOCATION)
})