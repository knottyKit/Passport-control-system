<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectkdtph.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 0;
$toPrint = false;
#endregion

#region get data values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
#endregion

//36 is permission ID
#region main function
try {
    $userQ = "SELECT COUNT(*) FROM user_permissions WHERE permission_id = 36 AND fldEmployeeNum = :empID";
    $userStmt = $connkdt->prepare($userQ);
    $userStmt->execute([":empID" => "$empID"]);
    $userCount = $userStmt->fetchColumn($userStmt);
    if ($userCount > 0) {
        $toPrint = true;
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo $toPrint;
