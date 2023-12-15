<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$number = $birthdate = $issued = $expiry = NULL;
$empID = 0;
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["number"])) {
    $number = $_POST["number"];
}
if (!empty($_POST["birthdate"])) {
    $birthdate = $_POST["birthdate"];
}
if (!empty($_POST["issued"])) {
    $issued = $_POST["issued"];
}
if (!empty($_POST["expiry"])) {
    $expiry = $_POST["expiry"];
}

try {
    $updateQ = "UPDATE passport_details SET passport_birthdate = :birthdate, passport_number = :number, passport_issue = :issued, passport_expiry = :expiry 
    WHERE emp_number = :empID";
    $updateStmt = $connpcs->prepare($updateQ);
    $updateStmt->execute([":birthdate" => "$birthdate", ":number" => "$number", ":issued" => "$issued", ":expiry" => "$expiry", ":empID" => "$empID"]);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
