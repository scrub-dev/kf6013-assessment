const getClimateTweets = () => {
  const query = encode("(#climatechange OR #netzero) OR (#climatechange #netzero)")// Twitter v2 Query String
  const tweetEndpoint = "/utils/twitter/get_tweets.php"
  const testQuery = encode("#london")                                            // Test Query to get tweet data with location tags
  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const getLocationFromUserLocation = async tweetLocation => {                    // Gets the geo data from a user's location
  let url = "/utils/location.php"
  let query = "?q=" + encode(tweetLocation)

  return new Promise(resolve => {                                               // Returns a promise so the rest of the code can wait for it to complete
    $.getJSON(url + query, res => {
      resolve(res)
    })
  })
}

const getLocation = async (tweet, places) => {                                  // Creates a lat/lng pair for the location of the tweet (Either tweet position or User location)
  if (tweet.geo && tweet.geo.place_id && places){                               // Check if tweet has location data
    let geo = getGeoInformation(tweet, places)
    return {
      name: geo.name,
      coordinates : geo.geo.bbox
    }
  } else if (tweet.author.location) {                                           // Check if the author has a location
    let results = await getLocationFromUserLocation(tweet.author.location)
    let status = results.status
    results = results.results
    if(status !== "OK") return                                                  // Makes sure its a valid location
    return {
      name: results[0].address_components[0].short_name,
      coordinates: results[0].geometry.location
    }
  }
}

const parseTweets = async tweets => {                                           // Parses the tweets, adding geo data and user data, cleaning hashtags
  let tweetPromiseArr = []                                                      // Array to store parseTweet promises
  tweets.data.forEach(async tweet => {                                          // Parses all tweets
    // if(!tweet.text.startsWith("RT"))                                            // Skip retweets
      tweetPromiseArr.push(parseTweet(tweet, tweets))
  })

  let parsedTweets = await Promise.all(tweetPromiseArr)                         // Waits for all tweet parsing operations to complete

  let locationTweets = []
  parsedTweets.forEach(tweet => {                                               // Loops over the now parsed tweets
    if(tweet.geo){                                                              // Checks if tweets have geo data
      let icon = calculateIcon(tweet.hashtags)                                  // Gets the icon associated with the tweet based on hashtag contents
      if(icon !== undefined){                                                   // Ensure an Icon has been set before making the object (Icon undefined happens during a RT Thread)
        locationTweets.push({                                                   // creates new object containing the tweet information and adds it to the array
          location: {
            lat: tweet.geo.coordinates.lat,
            lng: tweet.geo.coordinates.lng,
            name: tweet.geo.name
          },
          content: tweet.text,
          author: tweet.author,
          icon: icon
        })
      }
    }
  })

  let markers = addMarkers(locationTweets)                                      // Creates the markers on the map based
  fitMarkers(markers)                                                           // Fits the map to the markers so all markers are visible
  displayTweets(tweets)                                                         // Displays the tweets below the map for viewing
}

const parseTweet = (tweet, tweets) => {                                         // Takes a tweet and parses it
  return new Promise(async res => {                                             // this function returns a promise so it can get user information if required
    if(tweet.entities.hashtags) cleanHashtags(tweet)                            // Cleans the hashtags (utils.js)
    tweet.author = getUserInformation(tweet, tweets.includes.users)             // Gets the user informaition (utils.js)
    tweet.geo = await getLocation(tweet)                                        // gets the geo data for the tweet and adds it to the tweet object
    res(tweet)                                                                  // resolves the promise with the new tweet object
  })
}

const addMarkers = locationTweets => {                                          // Adds markers based on locationTweets array
  let markers = []
  markers.push(HQMarker())                                                      // Adds the SNE HQ marker by default
  locationTweets.forEach(tweet => {                                             // Loops over each entry in the locationTweets array
    if(checkPoint(tweet.location)){                                             // Checks to make sure the tweet is based in the UK
      let marker = generateMarker(                                              // Generate a marker on the map with that tweet data
        tweet.icon,
        tweet.location,
        tweet.content,
        tweet.author
      )
      markers.push(marker)                                                      // Add the newly generated marker to the markers array
    }
  })
  return markers                                                                // Return the markers array for use with other functioned (like fitMarkers())
}

const fitMarkers = markers => {                                                 // Generates a bounding box that contains all markers, allowing te map to fit all markers
  let bounds = generateBounds(markers)                                          // Generates the bounding box
  map.fitBounds(bounds)                                                         // Gits the map to the bounding box
  if(markers.length === 1) map.setZoom(14)                                      // Sets a default zoom if only one marker is added, because its too zoomed in otherwise
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