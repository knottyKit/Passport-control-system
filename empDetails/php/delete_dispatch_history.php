<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchID = 0;
$message = [];
#endregion

#region get values
if (!empty($_POST["dispatchID"])) {
    $dispatchID = $_POST["dispatchID"];
}
#endregion

#region main function
try {
    $deleteQ = "DELETE FROM dispatch_list WHERE dispatch_id = :dispatchID";
    $deleteStmt = $connpcs->prepare($deleteQ);
    if($deleteStmt->execute([":dispatchID" => "$dispatchID"])) {
        $message["isSuccess"] = true;
        $message["message"] = "Delete sucessfully";
    } else {
        $message["isSuccess"] = false;
        $message["message"] = "Error on deleting";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($message);