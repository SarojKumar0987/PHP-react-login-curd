<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $data['id'];
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    $phone = htmlspecialchars($data['phone']);
    $gender = htmlspecialchars($data['gender']);

    $query = $conn->prepare("UPDATE records SET name = ?, email = ?, phone = ?, gender = ? WHERE id = ?");
    if ($query->execute([$name, $email, $phone, $gender, $id])) {
        echo json_encode(['status' => 200, 'message' => 'Record updated successfully']);
    } else {
        echo json_encode(['status' => 400, 'message' => 'Failed to update record']);
    }
}
?>
