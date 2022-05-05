const capitalizeFirstChar = string => string.charAt(0).toUpperCase() + string.slice(1);                 // Returns string with first character capitalised

const lowercase = string => string.toLowerCase();                                                       // Retuns string that is all lowercase

const uppercase = string => string.toUpperCase();                                                       // Retuns string that is all uppercase

const boxToPoint = array => {                                                                           // Converts a bounding box into a single lat/lng object
  return {lng: (array[0] + array[2]) / 2, lat: (array[1]  + array[3] ) / 2}
}

// converts the entitity array of hashtag objects into an array of hashtag strings
const cleanHashtags = tweet => {                                                                        // Converts hashtag objets into an array of hashtag strings
  tweet.hashtags = []
  tweet.entities.hashtags.forEach(hashtag => {
    tweet.hashtags.push(lowercase(hashtag.tag))
  })
}

// get an icon based on what hashtags are present
const calculateIcon = hashtags => {                                                                      // calculates the icon required based on what hashtags are in the tweet object
  if(hashtags.includes("climatechange") && hashtags.includes("netzero")) return getIcon(ICONS.both)
  if(hashtags.includes("climatechange")) return getIcon(ICONS.climate_change)
  if(hashtags.includes("netzero")) return getIcon(ICONS.net_zero)

  return getIcon(ICONS.net_zero)  
}

const getUserInformation = (tweet,  users) => {                                                          // Finds the author id in the author array and appends returns it
  return users.find(user => user.id === tweet.author_id)
}

const encode = string => encodeURIComponent(string)                                                      // URI Encodes a string for use in passing it to endpoints

const getDefaultLocation = () => { return {lat: 54.977399, lng: -1.6079944, name: "SNE HQ"}}             // Provides a default location (SNE HQ)

const areEqual = (location1, location2) => {
  return (location1.lat === location2.lat && location2.lng === location1.lng)
}

$(document).ready(() => {                                                                                // Hides the tweet list on lauch of webpage
  $("#tweet-list").hide()
  $("#tweet-toggle").click(() => {                                                                       // Toggles visibility when the button is clickeds
    $("#tweet-list").toggle()
  })
})
