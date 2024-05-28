<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/dbconnectnew.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

$emps = array();
$grpStmt = "";
$grpID = 0;
if (!empty($_POST['grpID']) and $_POST['grpID'] != 0) {
    $grpID = $_POST['grpID'];
    $grpStmt = "AND `group_id` IN ($grpID)";
}
#endregion

#region main query
try {
    $empQ = "SELECT CONCAT(`surname`,', ',`firstname`) AS ename, `id` FROM `employee_list` WHERE `emp_status` = 1 $grpStmt GROUP BY `id` ORDER BY `surname`";
    // die($empQ);
    $empStmt = $connnew->query($empQ);

    if ($empStmt->rowCount() > 0) {
        $emparr = $empStmt->fetchAll();
        foreach ($emparr as $emp) {
            $output = array();
            $name = $emp['ename'];
            $id = $emp['id'];
            $output += ["name" => $name];
            $output += ["id" => $id];
            array_push($emps, $output);
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

#endregion

#region FUNCTIONS

#endregion
echo json_encode($emps);
