<?php
namespace twitter;
include_once('../twitter/twitter_connection.php');     

$conn = create_connection($_REQUEST['oauth_token'],                 // Create a connection with the user details
                          $_REQUEST['oauth_token_secret'], 
                          1.1);                                      
$tweet_string = $_REQUEST['tweet'];                                 // Create a variable that stores the request string from "tweet"

$tweets = $conn->post("statuses/update", [                          // Send a tweet as the user
  "status" => urldecode($tweet_string)
]);
?>