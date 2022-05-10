<?php
namespace oauth;

use function twitter\connection_v2;

session_start();

include_once './oauth_config.php';                                                      // Provide the Oauth callback location
include_once '../twitter/twitter_connection.php';                                       // Provide a connection to the twitter api


$conn = connection_v2();                                                                // create a twitter api object
$res = $conn->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));  // request a token from the api object

if(!$res['oauth_callback_confirmed'] || $conn->getLastHttpCode() !== 200){              // Make sure connection was a success
  die("Something went wrong");                                                          // Kill the php process
}else{                                                                                  // If auth was a success

  $_SESSION['oauth_token'] = $res['oauth_token'];                                       // Create session variables for use later
  $_SESSION['oauth_token_secret'] = $res['oauth_token_secret'];                         // to make sure its not a duplicate when a user authorises

  $url = $conn->url('oauth/authorize', ["oauth_token" => $res["oauth_token"]]);         // Authorise with the oauth token returned previously
  header("Location: " . $url);                                                          // Go to the callback url with the tokens now attached
}
?>