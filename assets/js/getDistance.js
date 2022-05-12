const TRAVEL_MODES = {                                                                              // "Enum" for modes of transport
    driving: "DRIVING",
    transit: "TRANSIT",
    bike: "BICYCLING",
    walk: "WALKING"
}

const UNITS = {                                                                                     // "Enum" for Measurement Unitys
    metric: google.maps.UnitSystem.METRIC,
    imperial: google.maps.UnitSystem.IMPERIAL
}

const distanceService = new google.maps.DistanceMatrixService()                                     // Google Distance Matrix Object
const directionService = new google.maps.DirectionsService()                                        // Google Direction Object
const directionRenderer = new google.maps.DirectionsRenderer()                                      // Google Direction Renderer Object

const getDistance = (location1, location2) => {                                                     // Calculate the distance and time to a location from a location
    if(!location2) location2 = getDefaultLocation()                                                 // If there is no location2 provided, use the default location as location2
    if(areEqual(location1, location2)) return                                                       // If location1 and location2 are equal, dont calculate the distance

    distanceService.getDistanceMatrix({                                                             // Calculate the disance
        origins: [location2],
        destinations: [location1],
        travelMode: TRAVEL_MODES.driving,
        unitSystem: UNITS.imperial
    }, (res, status) => {
        if(status !== "OK" || res.rows[0].elements[0].status !== "OK") return                       // Make sure that google found both locations and the status is ok
        const distanceObject = {                                                                    // Created a temporary object to access data easier in future
            origin: res.originAddresses[0],
            destination: res.destinationAddresses[0],
            distance: res.rows[0].elements[0].distance,
            duration: res.rows[0].elements[0].duration
        }                                                                                           // Sets the distance panel to contain the distance information
        $("#distance-panel").html(`                                                                 
            <p>Origin: ${distanceObject.origin}</p>
            <p>Destination: ${distanceObject.destination}</p>
            <p>Distance: ${distanceObject.distance.text}</p>
            <p>Duration: ${distanceObject.duration.text}</p>
        `)
        $("#distance-panel").trigger("change")                                                      // Trigger the change event for the distance panel
    })
}

const getDirections = (location1, location2) => {                                                   // Get directions and display them on the map as well as provide details to arrive at location
    if(!location2) location2 = getDefaultLocation()                                                 // If there is no location2 provided, use the default location as location2
    if(areEqual(location1, location2)) return                                                       // If location1 and location2 are equal, dont calculate the directions
    let request = {                                                                                 // Create the request object for the direction service object
        origin: location2,
        destination: location1,
        travelMode: TRAVEL_MODES.driving,
        unitSystem: UNITS.imperial,
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: "optimistic"
        }
    }

    directionRenderer.setMap(getMap())                                                              // Get the google map object from another file
    directionRenderer.setPanel(document.getElementById("directions-panel"))                         // Set the direction data to the direction panel


    directionService.route(request, (res, status) => {                                              // If there is a route, set the directions of the route to the map
        if(status === 'OK') directionRenderer.setDirections(res)
    })
}