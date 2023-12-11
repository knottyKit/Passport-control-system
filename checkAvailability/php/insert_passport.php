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
$surname = NULL;
if (!empty($_POST['surname'])) {
    $surname = $_POST['surname'];
} else {
    $errorMsg['surname'] = "Surname Missing";
}
$firstname = NULL;
if (!empty($_POST['firstname'])) {
    $firstname = $_POST['firstname'];
} else {
    $errorMsg['firstname'] = "Firstname Missing";
}
$middlename = NULL;
if (!empty($_POST['middlename'])) {
    $middlename = $_POST['middlename'];
}
$nationality = NULL;
if (!empty($_POST['nationality'])) {
    $nationality = $_POST['nationality'];
} else {
    $errorMsg['nationality'] = "Nationality Missing";
}
$bday = date("Y-m-d");
if (!empty($_POST['bday'])) {
    $bday = $_POST['bday'];
} else {
    $errorMsg['bday'] = "Date of Birth Missing";
}
$sex = 1;
if (!empty($_POST['sex'])) {
    $sex = $_POST['sex'];
}
$passNumber = NULL;
if (!empty($_POST['passNumber'])) {
    $passNumber = $_POST['passNumber'];
} else {
    $errorMsg['passNumber'] = "Passport Number Missing";
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
$insertQ = "INSERT INTO `passport_details`(`emp_number`,`passport_surname`,`passport_firstname`,`passport_middlename`,`passport_nationality`,`passport_birthdate`,`sex_id`,`passport_number`,`passport_issue`,`passport_expiry`) VALUES (:empNumber,:surname,:firstname,:middlename,:nationality,:bday,:sex,:passNumber,:dateIssue,:dateExpire)";
$insertStmt = $connpcs->prepare($insertQ);
#endregion

#region Entries Query
try {
    if (empty($errorMsg)) {
        $insertStmt->execute([":empNumber" => $empNumber, ":surname" => $surname, ":firstname" => $firstname, ":middlename" => $middlename, ":nationality" => $nationality, ":bday" => $bday, ":sex" => $sex, ":passNumber" => $passNumber, ":dateIssue" => $dateIssue, ":dateExpire" => $dateExpire]);
    }
} catch (Exception $e) {
    $errorCode = $e->getCode();
    // $err  = $e->getLine();
    switch ($errorCode) {
        case 23000:
            $errorMsg['duplicate'] = "Date of Issue/Expiry Identical to Previous Passport";
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
