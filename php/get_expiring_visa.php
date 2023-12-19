<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$expiringList = array();
$expireQ = "SELECT CONCAT(ed.emp_firstname,' ',ed.emp_surname) AS ename,TIMESTAMPDIFF(DAY, CURDATE(), vd.visa_expiry) AS expiring_in FROM `visa_details` AS vd JOIN 
`employee_details` AS ed ON vd.emp_number=ed.emp_number WHERE vd.visa_expiry>=CURDATE() AND  vd.visa_expiry <= DATE_ADD(CURDATE(), INTERVAL 7 MONTH) AND ed.emp_dispatch = 1 
OR vd.visa_expiry < CURDATE()";
$expireStmt = $connpcs->prepare($expireQ);
#endregion

#region Entries Query
try {
    $expireStmt->execute();
    $expireArr = $expireStmt->fetchAll();
    foreach ($expireArr as $exp) {
        $output = array();
        $name = $exp['ename'];
        $until = (int)$exp['expiring_in'];
        if ($until < 0) {
            $until = 0;
        }
        $output["name"] = $name;
        $output["until"] = $until;
        array_push($expiringList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($expiringList, JSON_PRETTY_PRINT);
