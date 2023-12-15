<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchID = 0;
$dateFrom = $dateTo = NULL;
#endregion

#region get values
if (!empty($_POST["dispatchID"])) {
    $dispatchID = $_POST["dispatchID"];
}
if (!empty($_POST["dateFrom"])) {
    $dateFrom = $_POST["dateFrom"];
}
if (!empty($_POST["dateTo"])) {
    $dateTo = $_POST["dateTo"];
}
#endregion

#region main function
try {
    $updateQ = "UPDATE dispatch_list SET dispatch_from = :dateFrom, dispatch_to = :dateTo WHERE dispatch_id = :dispatchID";
    $updateStmt = $connpcs->prepare($updateQ);
    $updateStmt->execute([":dateFrom" => "$dateFrom", ":dateTo" => "$dateTo", ":dispatchID" => "$dispatchID"]);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion