<?php
// ajusta com os teus valores
$db_host = 'localhost';
$db_name = 'fauxclor_radio';
$db_user = 'fauxclor_radio';
$db_pass = '1ZPAya$q8E';

try {
  $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  http_response_code(500);
  exit;
}
