<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 0;
$passport = array();
#endregion

#region get data values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
#endregion

#region main function
try {
    $passportQ = "SELECT passport_number as number, passport_birthdate as bday, passport_issue as issue, passport_expiry as expiry FROM passport_details 
    WHERE emp_number = :empID";
    $passportStmt = $connpcs->prepare($passportQ);
    $passportStmt->execute([":empID" => "$empID"]);
    $passportDeets = $passportStmt->fetchAll();

    foreach ($passportDeets as $val) {
        $issued = date_create($val["issue"]);
        $expiry = date_create($val["expiry"]);
        $val["valid"] = true;

        if ($expiry < $issued) {
            $val["valid"] = false;
        }

        array_push($passport, $val);
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($passport);
