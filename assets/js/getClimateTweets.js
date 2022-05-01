const getClimateTweets = () => {
  const query = encode("(#climatechange OR #netzero) OR (#climatechange #netzero)")
  const tweetEndpoint = "/utils/twitter/get_tweets.php"

  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const parseTweets = tweets => {
  tweets.data.forEach(tweet => {
    if(tweet.entities.hashtags !== undefined){
      cleanHashtags(tweet)
    }
    tweet.author = getUserInformation(tweet, tweets.includes.users)

    if(tweet.geo){
      tweets.includes.places.forEach(geo => {
        if(geo.id == tweet.geo.place_id) {
          tweet.geo = geo
          tweet.geo.point = boxToPoint(tweet.geo.geo.bbox)
        }
      })
      let location = tweet.geo.point
      let icon = calculateIcon(tweet.hashtags)
      addGeoDataToMap(icon, location, tweet.text, tweet.author)
    }
  })
}

const addGeoDataToMap = (icon, location, content, author) => {

}

const displayTweets = (tweets, count) => {
  const displayTweets = tweets.slice(0, count);
}

$(document).ready(getClimateTweets())