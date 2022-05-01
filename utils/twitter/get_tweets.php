<?php
namespace twitter;

include_once('./twitter_connection.php');
$conn = connection_v2();
$query_string = $_REQUEST['q'];//get query string by requests

$params = [
  "query"=>$query_string, // the string to search by
  "max_results" => 100,
  'tweet.fields' => 'text,geo,id,entities',
  'expansions' => 'geo.place_id', 
  'place.fields' =>'country,country_code,full_name,geo,id,name',
];

$tweets = $conn->get("tweets/search/recent", $params);
echo(json_encode($tweets));
?>