<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$searchkey = NULL;
$groupID = $sortKey = 0;
$dispatch = 1;
$employees = array();
$groupQuery = "1";
$searchStmt = "";
$sortKey = 1;
#endregion

#region Set Variable Values
if (!empty($_POST["groupID"])) {
    $groupID = $_POST["groupID"];
}
if ($groupID != 0) {
    $groupQuery = "ed.group_id IN ($groupID)";
}
if (!empty($_POST['searchkey'])) {
    $searchkey = $_POST['searchkey'];
    $searchStmt = "AND (CONCAT_WS(' ',ed.firstname,ed.surname) LIKE '%$searchkey%' OR ed.id LIKE '%$searchkey%')";
}
#endregion

#region main query
try {
    $employeesQuery = "SELECT ed.id as empID, ed.surname as lastname, ed.firstname as firstname, gl.abbreviation as groupAbbr, pd.passport_expiry as passportExpiry, 
    vd.visa_expiry as visaExpiry FROM kdtphdb_new.employee_list as ed LEFT JOIN kdtphdb_new.group_list as gl ON ed.group_id = gl.id LEFT JOIN passport_details as pd 
    ON ed.id = pd.emp_number LEFT JOIN visa_details as vd ON ed.id = vd.emp_number WHERE ed.emp_status = 1 AND $groupQuery $searchStmt ORDER BY ed.id";
    $empStmt = $connpcs->prepare($employeesQuery);
    $empStmt->execute([]);
    if ($empStmt->rowCount() > 0) {
        $employeeDeets = $empStmt->fetchAll();
        foreach ($employeeDeets as &$val) {
            if ($val["passportExpiry"] !== null) {
                $pass = strtotime($val["passportExpiry"]);
                $val["passportExpiry"] = date("d M Y", $pass);
            } else {
                $val["passportExpiry"] = "None";
            }
            if ($val["visaExpiry"] !== null) {
                $visa = strtotime($val["visaExpiry"]);
                $val["visaExpiry"] = date("d M Y", $visa);
            } else {
                $val["visaExpiry"] = "None";
            }
        }
        $employees = $employeeDeets;

        // if (!empty($_POST["searchkey"])) {
        //     $searchkey = $_POST["searchkey"];

        //     foreach ($employeeDeets as $val) {
        //         $lastname = strtolower($val["lastname"]);
        //         $firstname = strtolower($val["firstname"]);
        //         $empID = $val["empID"];

        //         if (strpos($lastname, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         } else if (strpos($firstname, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         } else if (strpos($empID, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         }
        //     }
        // } else {
        //     $employees = $employeeDeets;
        // }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($employees);
