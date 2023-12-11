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
$expireQ = "SELECT CONCAT(ed.emp_firstname,' ',ed.emp_surname) AS ename,TIMESTAMPDIFF(DAY, CURDATE(), pd.passport_expiry) AS expiring_in FROM `passport_details` AS pd JOIN `employee_details` AS ed ON pd.emp_number=ed.emp_number WHERE pd.passport_expiry>=CURDATE() AND  pd.passport_expiry <= DATE_ADD(CURDATE(), INTERVAL 10 MONTH) AND ed.emp_dispatch = 1 AND pd.passport_expiry=(SELECT MAX(passport_expiry) FROM passport_details WHERE emp_number=pd.emp_number)";
$expireStmt = $connpcs->prepare($expireQ);
#endregion

#region Entries Query
try {
    $expireStmt->execute();
    $expireArr = $expireStmt->fetchAll();
    foreach ($expireArr as $exp) {
        $output = array();
        $name = $exp['ename'];
        $untildays = (int)$exp['expiring_in'];
        $until = round($untildays / 30);
        $output += ["name" => $name];
        $output += ["until" => $until];
        array_push($expiringList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($expiringList, JSON_PRETTY_PRINT);
