<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../global/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empNum = 0;
if (!empty($_POST['empnum'])) {
    $empNum = $_POST['empnum'];
}
$membersStatement = "";
$groupMembers = getMembers($empNum);
if (count($groupMembers) > 0) {
    $implodeString = implode("','", array_values($groupMembers));
    $membersStatement = "(AND ed.id IN ('" . $implodeString . "'))";
}
$expiringList = array();
$expireQ = "SELECT CONCAT(ed.firstname,' ',ed.surname) AS ename,TIMESTAMPDIFF(DAY, CURDATE(), pd.passport_expiry) AS expiring_in,ed.id FROM `passport_details` AS pd 
JOIN kdtphdb_new.employee_list AS ed ON pd.emp_number=ed.id WHERE pd.passport_expiry>=CURDATE() AND  pd.passport_expiry <= DATE_ADD(CURDATE(), INTERVAL 10 MONTH) 
AND ed.emp_status = 1 OR pd.passport_expiry < CURDATE() $membersStatement ORDER BY CASE WHEN pd.passport_expiry>=CURDATE() THEN 1 ELSE pd.passport_expiry END";
$expireStmt = $connpcs->prepare($expireQ);
#endregion

#region Entries Query
try {
    $expireStmt->execute();
    $expireArr = $expireStmt->fetchAll();
    foreach ($expireArr as $exp) {
        $output = array();
        $name = $exp['ename'];
        $id = $exp['emp_number'];
        $until = (int)$exp['expiring_in'];
        if ($until < 0) {
            $until = 0;
        }
        $output["name"] = $name;
        $output["id"] = $id;
        $output["until"] = $until;
        array_push($expiringList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($expiringList, JSON_PRETTY_PRINT);
