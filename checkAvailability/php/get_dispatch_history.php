<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

$dispatch = array();
$empID = NULL;
if (!empty($_POST['empID'])) {
    $empID = (int)$_POST['empID'];
} else {
    die(json_encode($pass));
}
$yearScope = NULL;
$yrStmt = '';
if (isset($_POST['yScope']) && json_decode($_POST['yScope'])) {
    $yearScope = date("Y");
    $yrStmt = " AND (dispatch_from LIKE '$yearScope-%' OR dispatch_to LIKE '$yearScope-%')";
}
#endregion

#region main query
try {
    $dQ = "SELECT dispatch_id,dispatch_from,dispatch_to  FROM `dispatch_list` WHERE emp_number = :empID $yrStmt ORDER BY dispatch_from DESC";
    $dStmt = $connpcs->prepare($dQ);
    $dStmt->execute([":empID" => $empID]);
    if ($dStmt->rowCount() > 0) {
        $darr = $dStmt->fetchAll();
        foreach ($darr as $disp) {
            $output = array();
            $id = $disp['dispatch_id'];
            $from = $disp['dispatch_from'];
            $to = $disp['dispatch_to'];
            $duration = getDuration($from, $to);
            $pastOneYear = getPastOneYear($empID, $to);
            $output += ["id" => $id];
            $output += ["from" => $from];
            $output += ["to" => $to];
            $output += ["duration" => $duration];
            $output += ["pastOne" => $pastOneYear];
            array_push($dispatch, $output);
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

#endregion

#region FUNCTIONS
function getDuration($start, $end)
{
    $timestampStart = strtotime($start);
    $timestampEnd = strtotime($end);
    $days_difference = floor(($timestampEnd - $timestampStart) / (60 * 60 * 24)) + 1;

    return $days_difference;
}
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
