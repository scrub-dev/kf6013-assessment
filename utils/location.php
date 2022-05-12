<?php
// The purpose of these files is to hide API Keys from the frontend 
// where possible, and also provide a simpler way to pass in information 
// by setting some request parameters now instead of in the frontend
//construct an array from the request paramenters
$location = $_REQUEST['q'];

$key = "AIzaSyCAtVLkyVQbMTMJdH5ufI0Ir2Wrw39Uo4s"; //account to access api

$geocode_api = "https://maps.googleapis.com/maps/api/geocode/json" 
              . "?key=" . $key
              . "&address=" . urlencode($location);
$arrContextOptions=array(
  "ssl"=>array(
    "verify_peer"=>false,
    "verify_peer_name"=>false,
  ),
);  
$result = file_get_contents($geocode_api); // Get API Data

header('Content-type: application/json');
echo($result); // echo api data out
?>