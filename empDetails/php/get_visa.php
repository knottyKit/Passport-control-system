<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 0;
$visa = array();
#endregion

#region get data values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
#endregion

#region main function
try {
    $visaQ = "SELECT visa_number as number, visa_issue as issue, visa_expiry as expiry FROM visa_details WHERE emp_number = :empID";
    $visaStmt = $connpcs->prepare($visaQ);
    $visaStmt->execute([":empID" => "$empID"]);
    $visaDeets = $visaStmt->fetchAll();

    foreach ($visaDeets as $val) {
        $expiry = new DateTime($val["expiry"]);
        $dateNow = new DateTime();
        $val["valid"] = true;

        if ($expiry < $dateNow) {
            $val["valid"] = false;
        }

        array_push($visa, $val);
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($visa);
