<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$searchkey = NULL;
$dispatch = $groupID = 0;
$employees = array();
$groupQuery = "";
#endregion

#region Set Variable Values
if (!empty($_POST["groupID"])) {
    $groupID = $_POST["groupID"];
}
if (!empty($_POST["dispatch"])) {
    $dispatch = $_POST["dispatch"];
}
if ($groupID != 0) {
    $groupQuery = "ed.group_id = $groupID AND";
}
#endregion

#region main query
try {
    $employeesQuery = "SELECT ed.emp_number as empID, ed.emp_surname as lastname, ed.emp_firstname as firstname, pd.passport_expiry as passportExpiry, vd.visa_expiry as visaExpiry 
    FROM employee_details as ed LEFT JOIN passport_details as pd ON ed.emp_number = pd.emp_number LEFT JOIN visa_details as vd ON ed.emp_number = vd.emp_number WHERE $groupQuery 
    ed.emp_dispatch = :dispatch";
    $empStmt = $connpcs->prepare($employeesQuery);
    $empStmt->execute([":dispatch" => "$dispatch"]);
    $employeeDeets = $empStmt->fetchAll();

    if (!empty($_POST["searchkey"])) {
        $searchkey = $_POST["searchkey"];

        foreach ($employeeDeets as $val) {
            $lastname = strtolower($val["lastname"]);
            $firstname = strtolower($val["firstname"]);
            $empID = $val["empID"];

            if (strpos($lastname, $searchkey) !== false) {
                array_push($employees, $val);
            } else if (strpos($firstname, $searchkey) !== false) {
                array_push($employees, $val);
            } else if (strpos($empID, $searchkey) !== false) {
                array_push($employees, $val);
            }
        }
    } else {
        $employees = $employeeDeets;
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($employees);
