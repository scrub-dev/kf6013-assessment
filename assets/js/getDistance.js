const TRAVEL_MODES = {
    driving: "DRIVING",
    transit: "TRANSIT",
    bike: "BICYCLING",
    walk: "WALKING"
}

const UNITS = {
    metric: google.maps.UnitSystem.METRIC,
    imperial: google.maps.UnitSystem.IMPERIAL
}

const distanceService = new google.maps.DistanceMatrixService()
const directionService = new google.maps.DirectionsService()
const directionRenderer = new google.maps.DirectionsRenderer()

const getDistance = (location1, location2) => {
    if(!location2) location2 = getDefaultLocation()
    if(areEqual(location1, location2)) return

    distanceService.getDistanceMatrix({
        origins: [location2],
        destinations: [location1],
        travelMode: TRAVEL_MODES.driving,
        unitSystem: UNITS.imperial
    }, (res, status) => {
        if(status !== "OK" || res.rows[0].elements[0].status !== "OK") return
        const distanceObject = {
            origin: res.originAddresses[0],
            destination: res.destinationAddresses[0],
            distance: res.rows[0].elements[0].distance,
            duration: res.rows[0].elements[0].duration
        }
        $("#distance-panel").html(`
            <p>Origin: ${distanceObject.origin}</p>
            <p>Destination: ${distanceObject.destination}</p>
            <p>Distance: ${distanceObject.distance.text}</p>
            <p>Duration: ${distanceObject.duration.text}</p>
        `)
    })
}

const getDirections = (location1, location2) => {
    if(!location2) location2 = getDefaultLocation()
    if(areEqual(location1, location2)) return
    let request = {
        origin: location2,
        destination: location1,
        travelMode: TRAVEL_MODES.driving,
        unitSystem: UNITS.imperial,
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: "optimistic"
        }
    }

    directionRenderer.setMap(getMap())
    directionRenderer.setPanel(document.getElementById("directions-panel"))

    directionService.route(request, (res, status) => {
        if(status === 'OK') directionRenderer.setDirections(res)
    })
}