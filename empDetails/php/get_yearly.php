<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 446;
$yearlyDeets = array();
$yearNow = date('Y');
$yearPast = $yearNow - 1;
$yearFuture = $yearNow + 1;
$startNow = date('Y-01-01');
$endNow = date('Y-12-31');
$startPast = date('Y-01-01', strtotime('-1 year'));
$endPast = date('Y-12-31', strtotime('-1 year',));
$startFuture = date('Y-01-01', strtotime('+1 year'));
$endFuture = date('Y-12-31', strtotime('+1 year',));
#endregion

#region get data values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
#endregion

#region main function
try {
    $total["totalDaysPast"] = totalDuration($startPast, $endPast);
    $total["totalDaysNow"] = totalDuration($startNow, $endNow);
    $total["totalDaysFuture"] = totalDuration($startFuture, $endFuture);

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($total);

#region function
function totalDuration($startYear, $endYear)
{ 
    global $empID, $connpcs;
    $totalDays = 0;

    $yearNowQ = "SELECT dispatch_id, dispatch_from, dispatch_to FROM dispatch_list WHERE emp_number = :empID AND 
    ((`dispatch_from` >= :startYear AND `dispatch_from` <= :endYear) OR (`dispatch_to` <= :endYear AND `dispatch_to` >= :startYear))";
    $yearNowStmt = $connpcs->prepare($yearNowQ);
    $yearNowStmt->execute([":empID" => "$empID", ":startYear" => "$startYear", ":endYear" => "$endYear"]);
    if($yearNowStmt->rowCount() > 0) {
        $dispatch = $yearNowStmt->fetchAll();

        foreach($dispatch as $val) {
            $dateFrom = $val["dispatch_from"];
            $dateTo = $val["dispatch_to"];
            $daysDiff = getDuration($dateFrom, $dateTo);
            $totalDays += $daysDiff + 1;
        }
    }

    return $totalDays;
}

function getDuration($dateFrom, $dateTo)
{
    $yearNow = date("Y");
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