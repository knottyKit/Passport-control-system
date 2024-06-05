<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = $dispatch = 0;
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["dispatch"])) {
    $dispatch = $_POST["dispatch"];
}
#endregion

#region main function
try {
    $updateQ = "UPDATE employee_details SET emp_dispatch = :dispatch WHERE emp_number = :empID";
    $updateStmt = $connpcs->prepare($updateQ);
    if($updateStmt->execute([":dispatch" => "$dispatch", ":empID" => "$empID"])) {
        $message["isSuccess"] = true;
        $message["message"] = "Update successfull";
    } else {
        $message["isSuccess"] = false;
        $message["message"] = "Error on updating";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion