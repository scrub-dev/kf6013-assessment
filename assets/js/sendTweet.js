const TOTAL_CHARS = 280
let CLIENT_TOKENS = {}

$(document).ready(() => {
  getClientToken()
})

const getClientToken = () => {
  const endpoint = "/utils/authentication/get_user_conn.php"      // Get the user token
  const token = "?oauth_token=" + getParam("oauth_token")         // Get the token from the url
  const verify = "&oauth_verifier=" + getParam("oauth_verifier")  // get the verifier from the url
  $.getJSON(endpoint + token + verify, res => {
    CLIENT_TOKENS = res
  })
}

const reset = () => {                                             // Resets tweet box and count
  $("#tweet-count").css("color", "black")
  $("#tweet-count").text(TOTAL_CHARS)
  $("#tweet-box").val("")
}


const sendTweet = tweetString => {
  const endpoint = "/utils/twitter/send_tweet.php"                // Set the endpoint to the send tweet util
  const tweet = "?tweet=" + encode(tweetString)                   // encode the tweet string
  const token = "&oauth_token=" + CLIENT_TOKENS.oauth_token       // Get the token from the url
  const verify = "&oauth_token_secret=" + CLIENT_TOKENS.oauth_token_secret  // get the verifier from the url
  const url = endpoint + tweet + token + verify                   // combine the above strings

  if(getParam("oauth_token") == null
    || getParam("oauth_verifier") == null
    || tweetString == undefined) return                           // Make sure the required params exist
  
  if(tweetString.length > 140){                                   //  Make sure the tweet contents string isn't too long
    alert("Tweet length too long!")
    return
  }                             

  $.getJSON(url, () => {})                                        // send the request
}

$("#send-tweet").click(event => {                                 // when the send tweet button is pressed:
  event.preventDefault()                                          // prevent default
  sendTweet($("#tweet-box").val())                                // get the contents of the tweet box and send it to sendTweet function
  reset()
})

$("#tweet-box").on("input", () => {                               // Check when someone starts to enter text in the box
  let chars = $("#tweet-box").val()                               // Get the characters in the box
  let charsLeft = TOTAL_CHARS - chars.length                      // Calculate the amount of characters left
  $("#tweet-count").text(charsLeft)

  if(charsLeft <= 25) $("#tweet-count").css("color", "red")
  else {
    $("#tweet-count").css("color", "black")
  }
})