$(document).ready(() => {initMap()})                                // Initialise the map on load of document

let map                                                             // Create map object
const initMap = () => {                                             // Function for initialising the map
  map = new google.maps.Map(document.getElementById("map"), {       // Get the div where the map will be rendered
      center: getDefaultLocation(),                                 // Centre the map on the default location
      zoom: 14                                                      // Set a default zoom
  })
}

const getMap = () => {                                              // Function for getting the map object in other files
  if(map !== undefined) return map                                  // make sure map is not undefined before returning the object
}