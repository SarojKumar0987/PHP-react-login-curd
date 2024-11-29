<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json");

session_start();

if (isset($_SESSION['user_id'])) {
    session_unset(); 
    session_destroy();

    echo json_encode(['status' => 200, 'message' => 'Logout successful']);
} else {
    echo json_encode(['status' => 400, 'message' => 'No active session found']);
}
?>
