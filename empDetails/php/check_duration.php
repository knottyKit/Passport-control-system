<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchCount = 0;
$empNum = NULL;
if (!empty($_POST['empID'])) {
    $empNum = $_POST['empID'];
}
$startYear = date("Y-01-01");
$endYear = date("Y-12-31");

$dispatchQ = "SELECT SUM(DATEDIFF(LEAST(:endYear, dispatch_to), GREATEST(:startYear, dispatch_from)) + 1) AS days_in_year FROM `dispatch_list` 
WHERE `dispatch_from` >= :startYear AND `dispatch_to` <= :endYear AND emp_number=:empID";
$dispatchStmt = $connpcs->prepare($dispatchQ);
#endregion

#region Entries Query
try {
    $dispatchStmt->execute([":startYear" => $startYear, ":endYear" => $endYear, ":empID" => $empNum]);
    $dispatchCount = (int)$dispatchStmt->fetchColumn();
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo $dispatchCount;
