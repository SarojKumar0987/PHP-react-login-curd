<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name = htmlspecialchars(trim($data['name']));
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($data['password']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 400, 'message' => 'Invalid email format']);
        exit;
    }

    $checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $checkEmail->execute([$email]);
    if ($checkEmail->rowCount() > 0) {
        echo json_encode(['status' => 409, 'message' => 'Email already exists']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $query = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($query->execute([$name, $email, $hashedPassword])) {
        echo json_encode(['status' => 201, 'message' => 'User registered successfully']);
    } else {
        echo json_encode(['status' => 500, 'message' => 'Failed to register user']);
    }
}
?>
