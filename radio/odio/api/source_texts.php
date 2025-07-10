<?php
header('Content-Type: application/json');
require 'config.php';

// busca até 50 textos aleatórios
$stmt = $pdo->query('SELECT content FROM odio ORDER BY RAND() LIMIT 50');
$texts = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo json_encode($texts);
