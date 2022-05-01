const getClimateTweets = () => {
  const query = encode("(#climatechange OR #netzero) OR (#climatechange #netzero)")
  const tweetEndpoint = "/utils/twitter/get_tweets.php"
  const testQuery = encode("#uk")

  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const parseTweets = tweets => {
  let locationTweets = []
  console.log(tweets)
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
      locationTweets.push({icon: icon, 
        location: location, 
        content: tweet.text, 
        author: tweet.author
      })
    }
  })

  if(locationTweets.length > 0){
    let markers = []
    locationTweets.forEach(tweet => {
      let marker = generateMarker(tweet.icon, 
        tweet.location, 
        tweet.content, 
        tweet.author
      )
      markers.push(marker)
    })
    let bounds = generateBounds(markers)
    console.log(bounds)
    map.fitBounds(bounds)
  }
}

const generateMarker = (icon, location, content, author) => {
  let map = getMap()
  const marker = new google.maps.Marker({
    position: location,
    map,
    title: author.username,
    icon: icon
  })

  const contentString = 
  `
    <div id="content">
      <div id="siteNotice">
        <p id="firstHeading"><strong>${author.name}</strong></p>
        <p id="bodyContent">${content}</p>
      </div>
    </div>
  `            
  const infoWindow = new google.maps.InfoWindow({
    content: contentString
  })

  marker.addListener("click", () => {
    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    })
  })

  return marker
}

const generateBounds = markers => {
  let bounds = new google.maps.LatLngBounds()
  markers.forEach(marker => bounds.extend(marker.getPosition()))
  return bounds
}

const displayTweets = (tweets, count) => {
  const displayTweets = tweets.slice(0, count);
}

$(document).ready(getClimateTweets())