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
        console.log(res)
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

    directionService.route(request, (res, status) => {
        console.log(status)
        if(status === 'OK') directionRenderer.setDirections(res)
    })
}