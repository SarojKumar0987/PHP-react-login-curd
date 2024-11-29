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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    $phone = htmlspecialchars($data['phone']);
    $gender = htmlspecialchars($data['gender']);

    $query = $conn->prepare("INSERT INTO records (name, email, phone, gender) VALUES (?, ?, ?, ?)");
    if ($query->execute([$name, $email, $phone, $gender])) {
        echo json_encode(['status' => 201, 'message' => 'Record created successfully']);
    } else {
        echo json_encode(['status' => 400, 'message' => 'Failed to create record']);
    }
}
?>
