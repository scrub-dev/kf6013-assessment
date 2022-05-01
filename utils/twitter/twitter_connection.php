<?php
namespace twitter;

include_once('../config.php');
require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

function connection_v2(){ // create a connection for other functions and classes to use
  $conn =  new TwitterOAuth(
    TWITTER['CONSUMER_KEY'], 
    TWITTER['CONSUMER_SECRET'], 
    TWITTER['ACCESS_TOKEN'], 
    TWITTER['ACCESS_SECRET']);
  $conn->setApiVersion("2");
  return $conn;
}

function connection_v1(){ // create a connection for other functions and classes to use
  $conn =  new TwitterOAuth(
    TWITTER['CONSUMER_KEY'], 
    TWITTER['CONSUMER_SECRET'], 
    TWITTER['ACCESS_TOKEN'], 
    TWITTER['ACCESS_SECRET']);
  $conn->setApiVersion("1.1");
  return $conn;
}
?>