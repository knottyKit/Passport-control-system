<?php
#region DB Connect
require_once '../dbconn/dbconnectkdtph.php';
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectnew.php';
require_once '../global/globalfunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchList = array();
$dateFilter = date("Y-m-d");
$empNum = 0;
if (!empty($_POST['empnum'])) {
    $empNum = $_POST['empnum'];
}
$membersStatement = "";
$groupMembers = getMembers($empNum);
if (count($groupMembers) > 0) {
    $implodeString = implode("','", array_values($groupMembers));
    $membersStatement = "AND ed.id IN ('" . $implodeString . "')";
}
#endregion

#region Entries Query
try {
    $dispatchQ = "SELECT CONCAT(ed.firstname,' ',ed.surname) AS ename, ll.location_name, dl.dispatch_from,dl.dispatch_to,pd.passport_expiry,vd.visa_expiry FROM 
    `dispatch_list` AS dl JOIN kdtphdb_new.employee_list AS ed ON dl.emp_number=ed.id JOIN `location_list` AS ll ON dl.location_id=ll.location_id LEFT JOIN `passport_details` 
    AS pd ON pd.emp_number=ed.id  LEFT JOIN `visa_details` AS vd ON vd.emp_number=ed.id WHERE dl.dispatch_to >= :dateFilter AND ed.emp_status=1 $membersStatement ORDER BY 
    dl.dispatch_id DESC";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":dateFilter" => $dateFilter]);
    $dispatchArr = $dispatchStmt->fetchAll();
    foreach ($dispatchArr as $disp) {
        $passValidity = false;
        $visaValidity = false;
        $output = array();
        $name = $disp['ename'];
        $location = $disp['location_name'];
        $from = strtotime($disp['dispatch_from']);
        $from = date("d M Y", $from);
        $to = strtotime($disp['dispatch_to']);
        $to = date("d M Y", $to);
        $passExp = $disp['passport_expiry'];
        $visaExp = $disp['visa_expiry'];
        if ($passExp && (strtotime($passExp) >= strtotime($to))) {
            $passValidity = true;
        }
        if ($visaExp && (strtotime($visaExp) >= strtotime($to))) {
            $visaValidity = true;
        }
        $output += ["name" => $name];
        $output += ["location" => $location];
        $output += ["from" => $from];
        $output += ["to" => $to];
        $output += ["passValid" => $passValidity];
        $output += ["visaValid" => $visaValidity];
        array_push($dispatchList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($dispatchList, JSON_PRETTY_PRINT);
