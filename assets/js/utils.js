const capitalizeFirstChar = string => string.charAt(0).toUpperCase() + string.slice(1);

const lowercase = string => string.toLowerCase();

const uppercase = string => string.toUpperCase();

const boxToPoint = array => {
  return {lat: (array[0] + array[2]) / 2, lng: (array[1]  + array[3] ) / 2}
}

const cleanHashtags = tweet => {
  tweet.hashtags = []
  tweet.entities.hashtags.forEach(hashtag => {
    tweet.hashtags.push(lowercase(hashtag.tag))
  })
}

const calculateIcon = hashtags => {
  if(hashtags.includes("climatechange") && hashtags.includes("netzero")) return getIcon(ICONS.both)
  if(hashtags.includes("climatechange")) return getIcon(ICONS.climate_change)
  if(hashtags.includes("netzero")) return getIcon(ICONS.net_zero)
}
