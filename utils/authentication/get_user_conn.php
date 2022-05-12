<?php
namespace twitter;                                                               // Sets the namespace

session_start();                                                                 // Starts a session

include_once('../twitter/twitter_connection.php');                               // Get the functions for getting a connection to the Twitter API


function get_user_connection($request_array){                                    // Creates a Twitter API Connection with the User credentials
  $req_token = [
    'oauth_token' => $_SESSION['oauth_token'],                                   // Pulls the temporary App credentials from the Session data
    'oauth_token_secret' => $_SESSION['oauth_token_secret']
  ];
  
  if(isset($request_array['oauth_token']) &&                                     // Make sure that there is request data
    $req_token['oauth_token'] !== $request_array['oauth_token']){                // Check if the request does not match the session variable
      header('Location: /');                                                     // Go back to a safe location if it failed
  }
  
  $conn = create_connection($req_token['oauth_token'],                           // Create a temporary connection
                            $req_token['oauth_token_secret'],
                            2);
  
  $token = $conn->oauth("oauth/access_token",
                        ["oauth_verifier" => $request_array['oauth_verifier']]); // Using temp connection, get full connection

  echo json_encode($token);                                                      // Return the tokens so the user can send multiple requests without having to reauthenticate
}

get_user_connection($_REQUEST);
?>