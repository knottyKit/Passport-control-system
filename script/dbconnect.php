<?php
$config = [
  'host' => 'kdt-ph',
  'dbname' => 'kdtphdb_new',
  'charset' => 'utf8mb4'
];
$username = 'kdt';
$password = 'none';
$dsn = 'mysql:' . http_build_query($config, '', ';');
try {
  $connkdtn = new PDO($dsn, $username, $password, [
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
