const capitalizeFirstChar = string => string.charAt(0).toUpperCase() + string.slice(1);                  // Returns string with first character capitalised

const lowercase = string => string.toLowerCase();                                                        // Retuns string that is all lowercase

const uppercase = string => string.toUpperCase();                                                        // Retuns string that is all uppercase

const boxToPoint = array => {                                                                            // Converts a bounding box into a single lat/lng object
  return {lng: (array[0] + array[2]) / 2, lat: (array[1]  + array[3] ) / 2}
}

// converts the entitity array of hashtag objects into an array of hashtag strings
const cleanHashtags = tweet => {                                                                         // Converts hashtag objets into an array of hashtag strings
  tweet.hashtags = []
  tweet.entities.hashtags.forEach(hashtag => {
    tweet.hashtags.push(lowercase(hashtag.tag))
  })
}

// get an icon based on what hashtags are present
const calculateIcon = hashtags => {                                                                     // calculates the icon required based on what hashtags are in the tweet object
  if(!hashtags) return
  if(hashtags.includes("climatechange") && hashtags.includes("netzero")) return getIcon(ICONS.both)
  if(hashtags.includes("climatechange")) return getIcon(ICONS.climate_change)
  if(hashtags.includes("netzero")) return getIcon(ICONS.net_zero)

  return getIcon(ICONS.net_zero)  
}

const getUserInformation = (tweet,  users) => {                                                           // Finds the author id in the author array and appends returns it
  return users.find(user => user.id === tweet.author_id)
}

const getGeoInformation = (tweet, places) => {                                                            // Gets the place from the place id in the tweet based on the includes arrays
  return places.find(place => place.id === tweet.geo.place_id)
}

const encode = string => encodeURIComponent(string)                                                       // URI Encodes a string for use in passing it to endpoints

const getDefaultLocation = () => { return {lat: 54.977399, lng: -1.6079944, name: "SNE HQ"}}              // Provides a default location (SNE HQ)

const areEqual = (location1, location2) => {                                                              // Compare two locations to check if they are equal without checking object equality
  return (location1.lat === location2.lat && location2.lng === location1.lng)
}

const getParam = name => {                                                                                // Gets a GET request parameter from the URL Bar
  let params = new URLSearchParams(window.location.search)
  return params.get(name)
}

$(document).ready(() => {
  $("#clear-directions").hide()                                                                           // Hides the clear directions button on launch of webpages    
  $("#tweet-list").hide()                                                                                 // Hides the tweet list on lauch of webpage
  $("#tweet-toggle").click(() => {                                                                        // Toggles visibility when the button is clickeds
    if($("#tweet-toggle").text() === "View Tweets"){                                                      // Changes the text of the button to display its current actions
      $("#tweet-toggle").text("Hide Tweets")
    }else{
      $("#tweet-toggle").text("View Tweets")
    }
    $("#tweet-list").toggle()                                                                             // Toggles the visibility of the tweet list
  })


  $("#distance-panel").change(() => {                                                                     // Monitors changes to the distance panel div
    let content = $("#distance-panel").text()                                                             // Gets the contents of the Div
    if(content.length > 0) $("#clear-directions").show()                                                  // If there is content, show the clear directions button
    else {
      $("#clear-directions").hide()                                                                       // Else (if no content), Hide the button
    }
  })
  $("#clear-directions").click(() => {                                                                    // When the clear directions button is clicked
    $("#distance-panel").html("")                                                                         // Clear the distance panel
    $("#directions-panel").html("")                                                                       // Clear the directions panel
    $("#distance-panel").trigger("change")                                                                // Trigger the change event to hide the button again
  })
})
