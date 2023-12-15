<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$number = $issued = $expiry = NULL;
$empID = 0;
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["number"])) {
    $number = $_POST["number"];
}
if (!empty($_POST["issued"])) {
    $issued = $_POST["issued"];
}
if (!empty($_POST["expiry"])) {
    $expiry = $_POST["expiry"];
}
#endregion

#region main function
try {
    $updateQ = "UPDATE visa_details SET visa_number = :number, visa_issue = :issued, visa_expiry = :expiry WHERE emp_number = :empID";
    $updateStmt = $connpcs->prepare($updateQ);
    $updateStmt->execute([":number" => "$number", ":issued" => "$issued", ":expiry" => "$expiry", ":empID" => $empID]);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion