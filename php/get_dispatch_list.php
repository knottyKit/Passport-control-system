<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchList = array();
$dateFilter = date("Y");
if (!empty($_POST['ySelect'])) {
    $dateFilter = date("Y", strtotime($_POST['ySelect']));
}
$dispatchQ = "SELECT CONCAT(ed.emp_firstname,' ',ed.emp_surname) AS ename, ll.location_name, dl.dispatch_from,dl.dispatch_to FROM `dispatch_list` AS dl JOIN `employee_details` AS ed ON dl.emp_number=ed.emp_number JOIN `location_list` AS ll ON dl.location_id=ll.location_id WHERE dl.dispatch_from LIKE :dateFilter";
$dispatchStmt = $connpcs->prepare($dispatchQ);
#endregion

#region Entries Query
try {
    $dispatchStmt->execute([":dateFilter" => "$dateFilter%"]);
    $dispatchArr = $dispatchStmt->fetchAll();
    foreach ($dispatchArr as $disp) {
        $output = array();
        $name = $disp['ename'];
        $location = $disp['location_name'];
        $from = $disp['dispatch_from'];
        $to = $disp['dispatch_to'];
        $output += ["name" => $name];
        $output += ["location" => $location];
        $output += ["from" => $from];
        $output += ["to" => $to];
        array_push($dispatchList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($dispatchList, JSON_PRETTY_PRINT);
