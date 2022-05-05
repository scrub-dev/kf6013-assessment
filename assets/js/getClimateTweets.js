const getClimateTweets = () => {
  const query = encode("(#climatechange OR #netzero) OR (#climatechange #netzero)")// Twitter v2 Query String
  const tweetEndpoint = "/utils/twitter/get_tweets.php"
  const testQuery = encode("#london")                                            // Test Query to get tweet data with location tags
  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const parseTweets = tweets => {                                                  // Parse the tweets from the quert
  console.log(tweets)
  let locationTweets = []
  tweets.data.forEach(tweet => {
    if(tweet.entities.hashtags !== undefined){
      cleanHashtags(tweet)
    }
    tweet.author = getUserInformation(tweet, tweets.includes.users)
    if(tweet.geo){                                                               // Make sure there is geo data on the tweet
      if(tweet.geo.coordinates){                                                 // Check if the Geo Data had coordinates or if it has a Place ID
        if(tweet.geo.coordinates.type.toLowerCase() === "point"){                // Check if the Coordinate is of type "point"
          tweet.geo.point = tweet.geo.coordinates.coordinates                    // Assign the geo data to a new object in the tweet object to be used later to add a marker to the map
        }else{
          tweet.geo.point = boxToPoint(tweet.geo.coordinates.coordinates)        // If the coordinates are a bounding box, convert the box to a point by averaging the location (./utils.js)
        }
      }else{                                                                     // If the geo data contains a place_id
        tweets.includes.places.forEach(geo => {                                  // For each place in the query, find the place ID that matches the tweet
          if(geo.id == tweet.geo.place_id) {                                     // If the ID's match from the tweet and the place id
            tweet.geo = geo                                                      // Assign the tweet geo object to the place geo object
            tweet.geo.point = boxToPoint(tweet.geo.geo.bbox)                     // Get the bounding box of the geo object and convert it to a point to put on the map
          }
        })
      }

      let location = {                                                           // Creates a location object with the lat/lng and location name 
        lat: tweet.geo.point.lat,
        lng: tweet.geo.point.lng,
        name: `${tweet.geo.country_code}, ${tweet.geo.name}`
      }
      let icon = calculateIcon(tweet.hashtags)                                   // Get the icon based on the tweets hashtags
      locationTweets.push({icon: icon,                                           // Create an an object with the icon, location, tweet content and tweet author to an array of tweets with location data
        location: location, 
        content: tweet.text, 
        author: tweet.author
      })
    }
  })

  let markers = []                                                               // Create an array of markers to be places on the map
  markers.push(HQMarker())                                                       // Add the initial marker (SNEHQ)
  if(locationTweets.length > 0){                                                 // Check if there are any tweets with data before continuing
    locationTweets.forEach(tweet => {                                            // For each geo tweet, generate a market
      if(checkPoint(tweet.location)){                                                  // Make sure point is in the UK
        let marker = generateMarker(tweet.icon, 
          tweet.location, 
          tweet.content, 
          tweet.author
        )
        markers.push(marker)                                                     // Add the generated marker to the markers array for calculated the bounding box of the markers later
      }                                                                          
    })
  }

  let bounds = generateBounds(markers)                                           // Generate bounds for the map to follow
  map.fitBounds(bounds)                                                          // Set the map zoom and position to make all markers visible
  if(markers.length === 1) map.setZoom(14)                                       // if there is only 1 marker, set it to this marker with a set zoom
  
  displayTweets(tweets)                                                          // Add all the tweets from the query to the page
  // addHQMarker()
}

const generateMarker = (icon, location, content, author) => {                    // Generates a marker object for adding to the google map object
  let map = getMap()                                                             // Get the google map object from another file
  const marker = new google.maps.Marker({                                        // Create a new google map marker object
    position: location,                                             
    map,
    title: author.username,
    icon: icon
  })

  const contentString =                                                          // Create the string that will be displayed when the marker is hovered over 
  `
    <div id="content">
      <div id="siteNotice">
        <p id="firstHeading"><strong>${author.name}</strong></p>
        <p id="bodyContent">${content}</p>
      </div>
    </div>
  `            
  const infoWindow = new google.maps.InfoWindow({                                // Create the infoWindow object that will display the marker content
    content: contentString
  })

  marker.addListener("mouseover", () => {                                        // Add a mouseover even to open the infowindow when the mouse is over the marker
    infoWindow.open({
      anchor: marker,
      map,
    })
  })
  marker.addListener("mouseout", () => {                                         // Close the info window when the mouse moves off the marker
    infoWindow.close()
  })

  marker.addListener("click", ()=> {                                             // When the marker is clicked
    getWeather(location)                                                         // Update the weather widget to the weather at the marker's location
    getDistance(location)                                                        // Get the distance to SNE HQ
    getDirections(location)                                                      // Get the directions to SNE HQ
  })

  return marker                                                                  // Return the marker object so the map can calculate its bounds
}

const generateBounds = markers => {                                              // Generate the bounds based on an array of markers
  let bounds = new google.maps.LatLngBounds()                                    // Generatge a google LatLngBounds object
  markers.forEach(marker => {
    if(marker.getPosition() !== undefined) bounds.extend(marker.getPosition())   // For every marker, extend the bounds to that markers position
  })                 
  return bounds                                                                  // return the bounds object
}

const displayTweets = (tweets) => {                                              // Display the tweets on the page
  let html = ""                                                                  // Create a blank html string to append to
  tweets.data.forEach(tweet => {                                                 // For each tweet from the query append to the HTML string
    html += 
    `
    <li>
      <p>${tweet.text}</p>
      <p>@${tweet.author.username}</p>
    </li>
    `
  })
  $("#tweet-list").html(html)                                                    // Set the html of the tweet-list tag in the html file to the html that has just been generated
}

const HQMarker = () => {                                                         // Generate a specific marker for the SNE HQ Location
  return generateMarker("",
  getDefaultLocation(), 
  "Sustainability North East Headquarters", 
  {username: "SNE HQ", name: "SNE HQ"})
}

const checkPoint = location => {                                                 // Calculate if the location point is in the UK
  const UK_POINTS = {
    tr: {lat: 63.251923, lng: -0.979067}, //Top right
    bl: {lat: 48.469447, lng: -10.987202}, //Bottom Left
  }

  return (location.lat > UK_POINTS.bl.lat && location.lat < UK_POINTS.tr.lat) && // Run the tweet query code when the document is ready
         (location.lng > UK_POINTS.bl.lng && location.lng < UK_POINTS.tr.lng)

}

$(document).ready(() => {                                                        
    getClimateTweets()
  }
)