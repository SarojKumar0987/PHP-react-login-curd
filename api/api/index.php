<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = $conn->prepare("SELECT * FROM records");
    $query->execute();
    $records = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 200, 'data' => $records]);
}
?>
