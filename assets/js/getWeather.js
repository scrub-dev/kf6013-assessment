const weatherEndpoint = "/utils/weather.php"                                                  //Local endpoint so UID is hidden


const getWeather = location => {                                                              //JQuery function for getting the weather data
  $.getJSON(weatherEndpoint 
            + `?lat=${location.lat}`
            + `&lng=${location.lng}`,
            res => {
              parseWeatherData(res, location)                                                 // Send weather data to callback function
            }
  )
}

const parseWeatherData = (weather, location) => {
  if(weather.status !== undefined){                                                           // If the weather has a status then there was an error
    $("#weatherWidget").html(`<li><a>No Weather data for this location</a></li>`)             // Display user friendly output if an error occured
  }else{
    $("#weatherWidget").html(generateWeatherWidget(weather.weatherObservation, location))     // Sets the widget html to the weather data if there is data to display
  }
}

//converts weather data into human readable widgets in a list.
const generateWeatherWidget = (weather, location) => {
  const PREFIX = "ww"                                                                         // Provide a prefix to make widget element easily identifieable
  return `                                                                                    
  <li><a id="${PREFIX}clouds">Clouds: ${weather.clouds}</a></li>
  <li><a id="${PREFIX}humidity">Humidity: ${weather.humidity}%</a></li>
  <li><a id="${PREFIX}temp">Temp: ${weather.temperature} c</a></li>
  <li><a id="${PREFIX}name">${location.name}</a></li>
  `                                                                                            // Generates the html string
}

//When document first loads, get default location
$(document).ready( ()=> {
  getWeather(getDefaultLocation())                                                             // Gets the weather at the default location on load
})