<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$errorMsg = array();
$empNumber = NULL;
if (!empty($_POST['empNum'])) {
    $empNumber = $_POST['empNum'];
} else {
    $errorMsg['empnum'] = "Employee Number Missing";
}
$locID = NULL;
if (!empty($_POST['locID'])) {
    $locID = $_POST['locID'];
} else {
    $errorMsg['location'] = "Location Missing";
}
$dateFrom = date("Y-m-d");
if (!empty($_POST['dateFrom'])) {
    $dateFrom = $_POST['dateFrom'];
} else {
    $errorMsg['dateFrom'] = "Date From Missing";
}
$dateTo = date("Y-m-d");
if (!empty($_POST['dateTo'])) {
    $dateTo = $_POST['dateTo'];
} else {
    $errorMsg['dateTo'] = "Date To Missing";
}
$newRange = [
    'start' => $dateFrom,
    'end' => $dateTo,
];
if (checkOverlap($empNumber, $newRange)) {
    $errorMsg['conflict'] = "Dispatch Conflict";
}
$insertQ = "INSERT INTO `dispatch_list`(`emp_number`,`location_id`,`dispatch_from`,`dispatch_to`) VALUES (:empNumber,:locID,:dateFrom,:dateTo)";
$insertStmt = $connpcs->prepare($insertQ);
#endregion

#region Entries Query
try {
    if (empty($errorMsg)) {
        $insertStmt->execute([":empNumber" => $empNumber, ":locID" => $locID, ":dateFrom" => $dateFrom, ":dateTo" => $dateTo]);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
if (!empty($errorMsg)) {
    echo json_encode(array('errors' => $errorMsg), JSON_PRETTY_PRINT);
}
