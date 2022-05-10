<?php
namespace twitter;

session_start();

include_once('../twitter/twitter_connection.php');     


function get_user_connection($request_array){
  $req_token = [
    'oauth_token' => $_SESSION['oauth_token'],
    'oauth_token_secret' => $_SESSION['oauth_token_secret']
  ];
  
  if(isset($request_array['oauth_token']) &&                                     // Make sure that there is request data
    $req_token['oauth_token'] !== $request_array['oauth_token']){                // Check if the request does not match the session variable
      header('Location: /');                                                // Go back to a safe location if it failed
  }
  
  $conn = create_connection($req_token['oauth_token'],                      // Create a temporary connection
                            $req_token['oauth_token_secret'],
                            2);
  
  $token = $conn->oauth("oauth/access_token",
                        ["oauth_verifier" => $request_array['oauth_verifier']]); // Using temp connection, get full connection
  
  // $user = create_connection($token['oauth_token'],                          // Create a full connection with user account
  //                           $token['oauth_token_secret'], 
  //                           1.1);
  echo json_encode($token);
}

get_user_connection($_REQUEST);
?>