<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchCount = array();
$empNum = NULL;
if (!empty($_POST['empNum'])) {
    $empNum = $_POST['empNum'];
}
$startYear = date("Y-01-01");
$endYear = date("Y-12-31");
if (!empty($_POST['yearDate'])) {
    $startYear = date("Y-01-01", strtotime($_POST['yearDate']));
    $endYear = date("Y-12-31", strtotime($_POST['yearDate']));
}
$dispatchQ = "SELECT emp_number,
SUM(DATEDIFF(LEAST(:endYear, dispatch_to), GREATEST(:startYear, dispatch_from)) + 1) AS days_in_year
FROM `dispatch_list`
WHERE :startYear BETWEEN `dispatch_from` AND `dispatch_to`
OR :endYear BETWEEN `dispatch_from` AND `dispatch_to`
OR `dispatch_from` >= :startYear AND `dispatch_to` <= :endYear";
$dispatchStmt = $connpcs->prepare($dispatchQ);
#endregion

#region Entries Query
try {
    $dispatchStmt->execute([":startYear" => $startYear, ":endYear" => $endYear]);
    $dispatchArr = $dispatchStmt->fetchAll();
    foreach ($dispatchArr as $disp) {
        $name = $disp['emp_number'];
        $count = $disp['days_in_year'];
        $dispatchCount += ["name" => $name];
        $dispatchCount += ["count" => $count];
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($dispatchCount, JSON_PRETTY_PRINT);
