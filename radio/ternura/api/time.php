<?php
header('Content-Type: application/json');
echo json_encode(time() * 1000); // Return current Unix timestamp in milliseconds
?>