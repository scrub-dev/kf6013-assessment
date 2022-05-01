const capitalizeFirstChar = string => string.charAt(0).toUpperCase() + string.slice(1);

const lowercase = string => string.toLowerCase();

const uppercase = string => string.toUpperCase();

//convers bbox geoJSON to a single point by finding the centre of the box it defines
const boxToPoint = array => {
  return {lng: (array[0] + array[2]) / 2, lat: (array[1]  + array[3] ) / 2}
}

// converts the entitity array of hashtag objects into an array of hashtag strings
const cleanHashtags = tweet => {
  tweet.hashtags = []
  tweet.entities.hashtags.forEach(hashtag => {
    tweet.hashtags.push(lowercase(hashtag.tag))
  })
}

// get an icon based on what hashtags are present
const calculateIcon = hashtags => {
  if(hashtags.includes("climatechange") && hashtags.includes("netzero")) return getIcon(ICONS.both)
  if(hashtags.includes("climatechange")) return getIcon(ICONS.climate_change)
  if(hashtags.includes("netzero")) return getIcon(ICONS.net_zero)

  return getIcon(ICONS.net_zero)
}

const getUserInformation = (tweet, users) => {
  return users.find(user => user.id === tweet.author_id)
}

const encode = string => encodeURIComponent(string)

const getDefaultLocation = () => { return {lat: 54.977399, lng: -1.6079944, name: "SNE HQ"}}

$(document).ready(() => {
  $("#tweet-list").hide()
  $("#tweet-toggle").click(() => {
    $("#tweet-list").toggle()
  })
})
