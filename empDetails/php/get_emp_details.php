<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$empID = 0;
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
    $empDeets = $empStmt->fetch();

    // foreach ($empDeets as $val) {
    // $val["pictureLink"] = "path/" . $val["id"] . "/picture.jpg";
    // }
    $version = date("YmdHis");
    $picLink = "../EmployeesFolder/" . $empDeets["id"] . "/picture.jpg";
    $empDeets["pictureLink"] = "./EmployeesFolder/" . $empDeets["id"] . "/picture.jpg?version=" . $version;
    if(!file_exists($picLink)) {
        $empDeets["pictureLink"] = "./EmployeesFolder/defaultqmsphoto.png";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($empDeets);
