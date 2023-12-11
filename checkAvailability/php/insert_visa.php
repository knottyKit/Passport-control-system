<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$errorMsg = array();
$empNumber = NULL;
if (!empty($_POST['empNum'])) {
    $empNumber = $_POST['empNum'];
} else {
    $errorMsg['empnum'] = "Employee Number Missing";
}
$visaNumber = NULL;
if (!empty($_POST['visaNumber'])) {
    $visaNumber = $_POST['visaNumber'];
} else {
    $errorMsg['visaNumber'] = "Visa Number Missing";
}
$dateIssue = date("Y-m-d");
if (!empty($_POST['dateIssue'])) {
    $dateIssue = $_POST['dateIssue'];
} else {
    $errorMsg['dateIssue'] = "Date of Issue Missing";
}
$dateExpire = date("Y-m-d");
if (!empty($_POST['dateExpire'])) {
    $dateExpire = $_POST['dateExpire'];
} else {
    $errorMsg['dateExpire'] = "Date of Expiry Missing";
}
$insertQ = "INSERT INTO `visa_details`(`emp_number`,`visa_number`,`visa_issue`,`visa_expiry`) VALUES (:empNumber,:visaNumber,:dateIssue,:dateExpire)";
$insertStmt = $connpcs->prepare($insertQ);
#endregion

#region Entries Query
try {
    if (empty($errorMsg)) {
        $insertStmt->execute([":empNumber" => $empNumber, ":visaNumber" => $visaNumber, ":dateIssue" => $dateIssue, ":dateExpire" => $dateExpire]);
    }
} catch (Exception $e) {
    $errorCode = $e->getCode();
    // $err  = $e->getLine();
    switch ($errorCode) {
        case 23000:
            $errorMsg['duplicate'] = "Date of Issue/Expiry Identical to Previous Visa";
            break;
        case '42S02':
            $errorMsg['table'] = "Table not found";
            break;
        case '42S22':
            $errorMsg['column'] = "Column not found";
            break;
        case 'HY093':
            $errorMsg['parameter'] = "Invalid parameter number";
            break;
        default:
            $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
            break;
    }
    // echo $err;
}

#endregion
if (!empty($errorMsg)) {
    echo json_encode(array('errors' => $errorMsg), JSON_PRETTY_PRINT);
}
