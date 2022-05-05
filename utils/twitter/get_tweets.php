<?php
namespace twitter;

include_once('./twitter_connection.php');                           // Include the functions that provide a connection to the twitter api
$conn = connection_v2();                                            // Get a Twitter V2 Connection object
$query_string = $_REQUEST['q'];                                     // Create a variable that stores the request string from "q"

$params = [                                                         // Generate the parameters for the Twitter API to query
  "query"=>$query_string, // the string to search by
  "max_results" => 100,
  'tweet.fields' => 'text,geo,id,entities,author_id',
  'expansions' => 'geo.place_id,author_id', 
  'place.fields' =>'country,country_code,full_name,geo,id,name',
  'user.fields' => 'location'
];

$tweets = $conn->get("tweets/search/recent", $params);              // Get the latest 100 tweets using the parameters above 
echo(json_encode($tweets));                                         // Send as json the tweets to be parsed by the frontend
?>