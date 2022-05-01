const getClimateTweets = () => {
  const query = encodeURIComponent("(#climatechange OR #netzero) OR (#climatechange #netzero)")
  const tweetEndpoint = "/utils/twitter/get_tweets.php"

  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const parseTweets = tweets => {

  tweets.data.forEach(tweet => {
    if(tweet.entities.hashtags !== undefined){
      cleanHashtags(tweet)
    }
    if(tweet.geo){
      tweets.includes.places.forEach(geo => {
        if(geo.id == tweet.geo.place_id) {
          tweet.geo = geo
          tweet.geo.point = boxToPoint(tweet.geo.geo.bbox)
        }
      })
      let location = tweet.geo.point
      let icon = calculateIcon(tweets.hashtags)
      addGeoDataToMap(icon, location)
    }
  })
  console.log(tweets)
}

const addGeoDataToMap = (icon, location) => {

}


$(document).ready(getClimateTweets())