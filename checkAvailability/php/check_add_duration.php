<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

$yearNow = date("Y");
$dateFrom = $dateTo = date("Y", 0 - 0 - 0000);
$dFrom = $dTo = 0 - 0 - 0000;
if (!empty($_POST["dateFrom"])) {
    $dFrom = $_POST["dateFrom"];
    $dateFrom = date("Y", strtotime($_POST["dateFrom"]));
}
if (!empty($_POST["dateTo"])) {
    $dTo = $_POST["dateTo"];
    $dateTo = date("Y", strtotime($_POST["dateTo"]));
}

if ($dateFrom != $yearNow && $dateTo == $yearNow && $dFrom <= $dTo) {
    $startYear = $yearNow . "-01-01";
    $endYear = $_POST["dateTo"];
} else if ($dateFrom == $yearNow && $dateTo == $yearNow && $dFrom <= $dTo) {
    $startYear = $_POST["dateFrom"];
    $endYear = $_POST["dateTo"];
} else if ($dateFrom == $yearNow && $dateTo != $yearNow && $dFrom <= $dTo) {
    $startYear = $_POST["dateFrom"];
    $endYear = $yearNow . "-12-31";
} else {
    $startYear = $yearNow . "-12-31";
    $endYear = $yearNow . "-12-31";
}
$startYear = new DateTime($startYear);
$endYear = new DateTime($endYear);

$difference = $startYear->diff($endYear);

echo $difference->days;
