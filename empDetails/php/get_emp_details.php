<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 0;
$emp = array();
#endregion

#region get data values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
#endregion

#region main function
try {
    $empQuery = "SELECT emp_number as id, emp_surname as lastname, emp_firstname as firstname, emp_dispatch as dispatch FROM employee_details 
    WHERE emp_number = :empID";
    $empStmt = $connpcs->prepare($empQuery);
    $empStmt->execute([":empID" => "$empID"]);
    $empDeets = $empStmt->fetchAll();

    foreach ($empDeets as $val) {
        $val["pictureLink"] = "path/" . $val["id"] . "/picture.jpg";
        array_push($emp, $val);
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($emp);
