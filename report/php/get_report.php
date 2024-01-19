<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dateNow = date('Y');
$groupID = 0;
$groupQuery = "";
$finalReport = New ArrayObject();
#endregion

#region get data values
if (!empty($_POST["yearSelected"])) {
    $dateNow = $_POST["yearSelected"];
}
if (!empty($_POST["groupID"])) {
    $groupID = $_POST["groupID"];
}
if ($groupID != 0) {
    $groupQuery = "WHERE group_id = $groupID";
}

$startYear = $dateNow . "-01-01";
$endYear = $dateNow . "-12-31";
#endregion

#region main
try {
    $getGroups = "SELECT group_id as id, group_name as name, (SELECT COUNT(*) FROM employee_details WHERE group_id = id) as empCount FROM group_list $groupQuery 
    HAVING empCount > 0 ORDER BY group_name";
    $groupsStmt = $connpcs->prepare($getGroups);
    $groupsStmt->execute([]);
    $groups = $groupsStmt->fetchAll();
    
    foreach($groups as $gval) {
        $oneGroupID = $gval["id"];
        $groupName = $gval["name"];

        // $reportQ = "SELECT ed.emp_number as id, CONCAT(UPPER(ed.emp_surname), ', ', ed.emp_firstname) as empName, gl.group_abbr as groupName, vd.visa_expiry as visaExpiry, 
        // (SELECT COUNT(*) FROM dispatch_list WHERE emp_number = id AND ((`dispatch_from` >= :startYear AND `dispatch_from` <= :endYear) OR (`dispatch_to` <= :endYear AND 
        // `dispatch_to` >= :startYear))) as dCount FROM employee_details as ed LEFT JOIN group_list as gl ON ed.group_id = gl.group_id LEFT JOIN visa_details as vd ON ed.emp_number = 
        // vd.emp_number WHERE ed.emp_dispatch = 1 AND ed.group_id = :oneGroupID HAVING dCount > 0 ORDER BY ed.emp_number";

        $reportQ = "SELECT ed.emp_number as id, CONCAT(UPPER(ed.emp_surname), ', ', ed.emp_firstname) as empName, gl.group_abbr as groupName, vd.visa_issue as visaIssue,
        vd.visa_expiry as visaExpiry FROM employee_details as ed LEFT JOIN group_list as gl ON ed.group_id = gl.group_id LEFT JOIN visa_details as vd ON ed.emp_number = 
        vd.emp_number WHERE ed.emp_dispatch = 1 AND ed.group_id = :oneGroupID ORDER BY ed.emp_number";

        $reportStmt = $connpcs->prepare($reportQ);

        // $reportStmt->execute([":oneGroupID" => "$oneGroupID", ":startYear" => "$startYear", ":endYear" => "$endYear"]);
        $reportStmt->execute([":oneGroupID" => "$oneGroupID"]);
        $report = $reportStmt->fetchAll();
        $reportCount = count($report);

        if($reportCount > 0) {
            $userArray = array();
            foreach ($report as $val) {
                $empID = $val["id"];
    
                $dispatchQ = "SELECT dispatch_from, dispatch_to FROM dispatch_list WHERE emp_number = :empID AND ((`dispatch_from` >= :startYear AND `dispatch_from` <= :endYear) OR 
                (`dispatch_to` <= :endYear AND `dispatch_to` >= :startYear))";
                $dispatchStmt = $connpcs->prepare($dispatchQ);
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
                    $disval["totalPast"] =  getPastOneYear($empID, $toDate);
    
                    $daysDiff = getDuration($fromDate, $toDate, $dateNow);
                    $disval["duration"] = $daysDiff;
                    $days += $daysDiff;
    
                    array_push($dispatchArray, $disval);
                }

                

                if ($val["visaExpiry"] != null) {
                    $vExp = strtotime($val["visaExpiry"]);
                    $vIssue = strtotime($val["visaIssue"]);

                    $difference = convertStoY($vExp - $vIssue);
                    $visaDiff = $difference . " year/s ";
                    if($difference == 0) {
                        $difference = convertStoM($vExp - $vIssue);
                        $visaDiff = $difference . " month/s ";
                    }
                    $val["visaExpiry"] = "ICT VISA " . $visaDiff . date("m/d/Y", $vExp);
                } else {
                    $val["visaExpiry"] = "None";
                }
    
                $val["dispatch"] = $dispatchArray;
                $val["totalDays"] = $days;
    
                array_push($userArray, $val);
            }
            $finalReport->offsetSet($groupName, $userArray);
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($finalReport);

#region function
function getDuration($dateFrom, $dateTo, $dateNow)
{
    $yearNow = $dateNow;
    $dateFromYear = date("Y", strtotime($dateFrom));
    $dateToYear = date("Y", strtotime($dateTo));

    if($dateFrom > $dateTo) {
        return 0;
    }

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

    return $difference->days + 1;
}

function convertStoY($secs) {
    $secs += 86400;
    $secondsInAYear = 365 * 24 * 60 * 60;
    $years = floor($secs / $secondsInAYear);
    return $years;
}

function convertStoM($secs) {
    $secs += 86400;
    $secondsInAMonth = 2628000;
    $months = floor($secs / $secondsInAMonth);
    return $months;
}

function getPastOneYear($empID, $lastDay)
{
    global $connpcs;
    $firstDay = date('Y-m-d', strtotime($lastDay . '-1 year'));
    $dispatchQ = "SELECT SUM(DATEDIFF(LEAST(:endYear, dispatch_to), GREATEST(:startYear, dispatch_from)) + 1) AS days_in_year FROM `dispatch_list`
    WHERE `dispatch_from` >= :startYear AND `dispatch_to` <= :endYear AND emp_number=:empID";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":startYear" => $firstDay, ":endYear" => $lastDay, ":empID" => $empID]);
    $dispatchCount = $dispatchStmt->fetchColumn();
    return (int)$dispatchCount;
}
#endregion