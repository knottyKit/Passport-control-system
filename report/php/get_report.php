<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dateNow = date('Y');
$groupID = 0;
$groupQuery = "";
#endregion

#region get data values
if(!empty($_POST["yearSelected"])) {
    $dateNow = $_POST["yearSelected"];
}
if(!empty($_POST["groupID"])) {
    $groupID = $_POST["groupID"];
}
if($groupID != 0) {
    $groupQuery = "AND ed.group_id = $groupID";
}

$startYear = $dateNow . "-01-01";
$endYear = $dateNow . "-12-31";
#endregion

#region main
try {
    $reportQ = "SELECT ed.emp_number as id, CONCAT(UPPER(ed.emp_surname), ', ', ed.emp_firstname) as empName, gl.group_abbr as groupName, vd.visa_expiry as visaExpiry FROM 
    employee_details as ed LEFT JOIN group_list as gl ON ed.group_id = gl.group_id LEFT JOIN visa_details as vd ON ed.emp_number = vd.emp_number WHERE ed.emp_dispatch = 1 
    $groupQuery GROUP BY ed.group_id, ed.emp_number";
    $reportStmt = $connpcs -> prepare($reportQ);
    $reportStmt->execute([]);
    $report = $reportStmt -> fetchAll();

    $userArray = array();
    foreach($report as $val) {
        $empID = $val["id"];

        $dispatchQ = "SELECT dispatch_from, dispatch_to FROM dispatch_list WHERE emp_number = :empID AND ((`dispatch_from` >= :startYear AND `dispatch_from` <= :endYear) OR 
        (`dispatch_to` <= :endYear AND `dispatch_to` >= :startYear))";
        $dispatchStmt = $connpcs -> prepare($dispatchQ);
        $dispatchStmt->execute([":empID" => "$empID", ":startYear" => "$startYear", ":endYear" => "$endYear"]);
        $dispatch = $dispatchStmt->fetchAll();

        
        $days = 0;
        $dispatchArray = array();
        foreach ($dispatch as $disval) {
            $fromDate = $disval["dispatch_from"];
            $toDate = $disval["dispatch_to"];

            if ($fromDate !== null) {
                $fDate = strtotime($fromDate);
                $disval["dispatch_from"] = date("d M Y", $fDate);
            } else {
                $disval["dispatch_from"] = "None";
            }
            if ($toDate !== null) {
                $tDate = strtotime($toDate);
                $disval["dispatch_to"] = date("d M Y", $tDate);
            } else {
                $disval["dispatch_to"] = "None";
            }

            $daysDiff = getDuration($fromDate, $toDate, $dateNow);
            if($daysDiff > 0) {
                $daysDiff += 1;
            }
            $disval["duration"] = $daysDiff;
            $days += $daysDiff;

            array_push($dispatchArray, $disval);
        }
        $val["dispatch"] = $dispatchArray;
        $val["totalDays"] = $days;

        array_push($userArray, $val);
    }

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($userArray);

#region function
function getDuration($dateFrom, $dateTo, $dateNow)
{
    $yearNow = $dateNow;
    $dateFromYear = date("Y", strtotime($dateFrom));
    $dateToYear = date("Y", strtotime($dateTo));

    if ($dateFromYear != $yearNow && $dateToYear == $yearNow) {
        $startYear = $yearNow . "-01-01";
        $endYear = $dateTo;
    } else if ($dateFromYear == $yearNow && $dateToYear == $yearNow) {
        $startYear = $dateFrom;
        $endYear = $dateTo;
    } else if ($dateFromYear == $yearNow && $dateToYear != $yearNow) {
        $startYear = $dateFrom;
        $endYear = $yearNow . "-12-31";
    } else {
        $startYear = $yearNow . "-12-31";
        $endYear = $yearNow . "-12-31";
    }
    $startYear = new DateTime($startYear);
    $endYear = new DateTime($endYear);

    $difference = $startYear->diff($endYear);

    return $difference->days;
}
#endregion