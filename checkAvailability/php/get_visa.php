<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

$visa = array();
$empID = NULL;
if (!empty($_POST['empID'])) {
    $empID = (int)$_POST['empID'];
} else {
    die(json_encode($visa));
}
$startDate = NULL;
if (!empty($_POST['sDate'])) {
    $startDate = $_POST['sDate'];
}
$endDate = NULL;
if (!empty($_POST['eDate'])) {
    $endDate = $_POST['eDate'];
}
#endregion

#region main query
try {
    $visaQ = "SELECT visa_number,visa_issue,visa_expiry  FROM `visa_details` WHERE emp_number = :empID";
    $visaStmt = $connpcs->prepare($visaQ);
    $visaStmt->execute([":empID" => $empID]);
    if ($visaStmt->rowCount() > 0) {
        $visaarr = $visaStmt->fetchAll();
        foreach ($visaarr as $vs) {
            $number = $vs['visa_number'];
            $issue = $vs['visa_issue'];
            $expiry = $vs['visa_expiry'];
            $validity_dates = [
                'issue' => $issue,
                'expiry' => $expiry,
            ];
            $check_dates = [
                'start' => $startDate,
                'end' => $endDate,
            ];
            $isValid = isValid($validity_dates, $check_dates);
            $visa += ["number" => $number];
            $visa += ["issue" => $issue];
            $visa += ["expiry" => $expiry];
            $visa += ["valid" => $isValid];
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

#endregion

#region FUNCTIONS
function isValid($validity, $chkRange)
{
    $issue_date_timestamp = strtotime($validity['issue']);
    $expiry_date_timestamp = strtotime($validity['expiry']);
    $start_date = $chkRange['start'];
    $end_date = $chkRange['end'];

    // Both start and end dates are null, consider it valid
    if ($start_date === null && $end_date === null) {
        return true;
    }

    // Check if start date is provided and is after the visa issue date
    if ($start_date !== null && strtotime($start_date) < $issue_date_timestamp) {
        return false;
    }

    // Check if end date is provided and is before the visa expiry date
    if ($end_date !== null && strtotime($end_date) > $expiry_date_timestamp) {
        return false;
    }

    return true;
}
#endregion
echo json_encode($visa);
