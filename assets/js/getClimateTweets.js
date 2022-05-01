const getClimateTweets = () => {
  const query = encode("(#climatechange OR #netzero) OR (#climatechange #netzero)")
  const tweetEndpoint = "/utils/twitter/get_tweets.php"
  const testQuery = encode("#london")

  $.getJSON(tweetEndpoint + "?q=" + query, results => parseTweets(results))
}

const parseTweets = tweets => {
  let locationTweets = []
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
      let location = {
        lat: tweet.geo.point.lat,
        lng: tweet.geo.point.lng,
        name: `${tweet.geo.country_code}, ${tweet.geo.name}`
      }
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
    map.fitBounds(bounds)
    if(markers.length === 1) map.setZoom(14) // if there is only 1 marker, set it to this marker
  }
  displayTweets(tweets)
}

const generateMarker = (icon, location, content, author, locationName) => {
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

  marker.addListener("mouseover", () => {
    infoWindow.open({
      anchor: marker,
      map,
    })
  })
  marker.addListener("mouseout", () => {
    infoWindow.close()
  })

  marker.addListener("click", ()=> {
    getWeather(location)
  })

  return marker
}

const generateBounds = markers => {
  let bounds = new google.maps.LatLngBounds()
  markers.forEach(marker => bounds.extend(marker.getPosition()))
  return bounds
}

const displayTweets = (tweets) => {
  let html = ""
  tweets.data.forEach(tweet => {
    html += 
    `
    <li>
      <p>${tweet.text}</p>
      <p>@${tweet.author.username}</p>
    </li>
    `
  })
  $("#tweet-list").html(html)
}

$(document).ready(getClimateTweets())