$(document).ready(() => {initMap()})

let map
const initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
      center: getDefaultLocation(),
      zoom: 14
  })
}

const getMap = () => {
  if(map !== undefined) return map
}