<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'db.php';

// Handle the preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($data['id'])) {
        $id = $data['id'];

        // Prepare DELETE query
        $query = $conn->prepare("DELETE FROM records WHERE id = ?");
        if ($query->execute([$id])) {
            echo json_encode(['status' => 200, 'message' => 'Record deleted successfully']);
        } else {
            echo json_encode(['status' => 400, 'message' => 'Failed to delete record']);
        }
    } else {
        echo json_encode(['status' => 400, 'message' => 'ID is missing']);
    }
}
?>
