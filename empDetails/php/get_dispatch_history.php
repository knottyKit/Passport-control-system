<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$allyear = $empID = 0;
$year = date("Y");
$yearQuery = "AND date_added LIKE '%$year%'";
$dispatch = array();
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST['allyear'])) {
    $allyear = $_POST['allyear'];
}
if ($allyear == 1) {
    $yearQuery = "";
}

#region main function
try {
    $dispatchQ = "SELECT dispatch_id as id, dispatch_from as fromDate, dispatch_to as toDate FROM dispatch_list WHERE emp_number = :empID $yearQuery ORDER BY dispatch_from DESC";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":empID" => "$empID"]);
    $dispatchDeets = $dispatchStmt->fetchAll();

    foreach ($dispatchDeets as $val) {
        $from = date_create($val["fromDate"]);
        $to = date_create($val["toDate"]);

        $difference = $from->diff($to)->format("%a");
        $val["duration"] = $difference + 1;
        array_push($dispatch, $val);
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($dispatch);
