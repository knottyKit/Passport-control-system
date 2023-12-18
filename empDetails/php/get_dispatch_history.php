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
$yearQuery = "";
$dispatch = array();
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST['yScope'])) {
    $allyear = $_POST['yScope'];
}
if ($allyear == 1) {
    $yearQuery = "AND (dispatch_from LIKE '$year-%' OR dispatch_to LIKE '$year-%')";
}
#region mains
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
        $pastOne = getPastOneYear($empID, $val["toDate"]);
        $val["pastOne"] = $pastOne;
        array_push($dispatch, $val);
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

#region FUNCTIONS
function getPastOneYear($empID, $lastDay)
{
    global $connpcs;
    $firstDay = date('Y-m-d', strtotime($lastDay . '-1 year'));
    $dispatchQ = "SELECT
SUM(DATEDIFF(LEAST(:endYear, dispatch_to), GREATEST(:startYear, dispatch_from)) + 1) AS days_in_year
FROM `dispatch_list`
WHERE :startYear BETWEEN `dispatch_from` AND `dispatch_to`
OR :endYear BETWEEN `dispatch_from` AND `dispatch_to`
OR `dispatch_from` >= :startYear AND `dispatch_to` <= :endYear AND emp_number=:empID";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":startYear" => $firstDay, ":endYear" => $lastDay, ":empID" => $empID]);
    $dispatchCount = $dispatchStmt->fetchColumn();
    return (int)$dispatchCount;
}
#endregion
echo json_encode($dispatch);
