<?php
$host = 'localhost';
$db = 'react_curd';
$user = 'root';
$pass = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 500, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>


