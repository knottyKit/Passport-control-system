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
$expireQ = "SELECT CONCAT(ed.firstname,' ',ed.surname) AS ename,TIMESTAMPDIFF(DAY, CURDATE(), vd.visa_expiry) AS expiring_in,ed.id FROM `visa_details` AS vd JOIN 
kdtphdb_new.employee_list AS ed ON vd.emp_number=ed.id WHERE vd.visa_expiry>=CURDATE() AND  vd.visa_expiry <= DATE_ADD(CURDATE(), INTERVAL 7 MONTH) AND ed.emp_status = 1 
OR vd.visa_expiry < CURDATE() $membersStatement ORDER BY CASE WHEN vd.visa_expiry>=CURDATE() THEN 1 ELSE vd.visa_expiry END";
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
