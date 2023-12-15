<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

$pass = array();
$empID = NULL;
if (!empty($_POST['empID'])) {
    $empID = (int)$_POST['empID'];
} else {
    die(json_encode($pass));
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
    $passQ = "SELECT passport_number,passport_birthdate,passport_issue,passport_expiry  FROM `passport_details` WHERE emp_number = :empID";
    $passStmt = $connpcs->prepare($passQ);
    $passStmt->execute([":empID" => $empID]);
    if ($passStmt->rowCount() > 0) {
        $passarr = $passStmt->fetchAll();
        foreach ($passarr as $ps) {
            $number = $ps['passport_number'];
            $bday = $ps['passport_birthdate'];
            $issue = $ps['passport_issue'];
            $expiry = $ps['passport_expiry'];
            $validity_dates = [
                'issue' => $issue,
                'expiry' => $expiry,
            ];
            $check_dates = [
                'start' => $startDate,
                'end' => $endDate,
            ];
            $isValid = isValid($validity_dates, $check_dates);
            $pass += ["number" => $number];
            $pass += ["bday" => $bday];
            $pass += ["issue" => $issue];
            $pass += ["expiry" => $expiry];
            $pass += ["valid" => $isValid];
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

    if ($start_date === null && $end_date === null) {
        return true;
    }

    // Check if end date is within the validity range
    if ($start_date === null && $end_date !== null && strtotime($end_date) >= $issue_date_timestamp && strtotime($end_date) <= $expiry_date_timestamp) {
        return true;
    }

    // Check if start date is within the validity range
    if ($end_date === null && $start_date !== null && strtotime($start_date) >= $issue_date_timestamp && strtotime($start_date) <= $expiry_date_timestamp) {
        return true;
    }

    // Check if both start and end dates are within the validity range
    if ($start_date !== null && $end_date !== null && strtotime($start_date) >= $issue_date_timestamp && strtotime($end_date) <= $expiry_date_timestamp) {
        return true;
    }

    return false;
}
#endregion
echo json_encode($pass);
