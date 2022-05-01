<?php

//construct an array from the request paramenters
$location = Array(
  "lat" => $_REQUEST['lat'],
  "lng" => $_REQUEST['lng']
);

$uid = "scrub"; //account to access api

$weather_uri = "http://api.geonames.org/findNearByWeatherJSON?" 
              . "lat=" . $location['lat'] 
              . "&lng=" . $location['lng']
              . "&username=" . $uid; // Generating API URI String

$weather_data = file_get_contents($weather_uri); // Get API Data

header('Content-type: application/json');
echo($weather_data); // echo api data out
?>