<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_explorer";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Połączenie nieudane"]));
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $conn->real_escape_string($data['name']);
    $rating = (int)$data['rating'];
    $desc = $conn->real_escape_string($data['desc']);
    $img = $conn->real_escape_string($data['img']);

    $sql = "INSERT INTO testimonials (name, rating, description, img_url) 
            VALUES ('$name', $rating, '$desc', '$img')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}

$conn->close();
?>