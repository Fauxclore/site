<?php
header('Content-Type: application/json');
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$text = trim($data['text'] ?? '');

if ($text !== '') {
  $stmt = $pdo->prepare('INSERT INTO odio (content) VALUES (:text)');
  $stmt->execute([':text' => $text]);
}

http_response_code(200);
