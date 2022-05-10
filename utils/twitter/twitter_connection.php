<?php
namespace twitter;

include_once '../config.php';            // Load the config file that contains the keys
require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

function connection_v2(){                 // create a connection for other functions and classes to use
  $conn =  new TwitterOAuth(
    TWITTER['CONSUMER_KEY'], 
    TWITTER['CONSUMER_SECRET'], 
    TWITTER['ACCESS_TOKEN'], 
    TWITTER['ACCESS_SECRET']);
  $conn->setApiVersion("2");
  return $conn;
}

function connection_v1(){                 // create a connection for other functions and classes to use
  $conn =  new TwitterOAuth(
    TWITTER['CONSUMER_KEY'], 
    TWITTER['CONSUMER_SECRET'], 
    TWITTER['ACCESS_TOKEN'], 
    TWITTER['ACCESS_SECRET']);
  $conn->setApiVersion("1.1");
  return $conn;
}

function create_connection ($token, $token_secret, $api_version){ // Used in twitter 3-legged authentication
  $conn = new TwitterOAuth(
    TWITTER['CONSUMER_KEY'],
    TWITTER['CONSUMER_SECRET'],
    $token,
    $token_secret
  );
  $conn->setApiVersion($api_version);
  return $conn;
}
?>