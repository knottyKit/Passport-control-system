<?php
#region DB Connect
require_once '../../dbconn/dbconnectnew.php';
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$groups = array();
#endregion

#region get data values
if (!empty($_COOKIE["userID"])) {
    $userHash = $_COOKIE["userID"];
}
#endregion

#region main query
try {
    $empidQ = "SELECT `fldEmployeeNum` as empID FROM kdtphdb.kdtlogin WHERE fldUserHash = :userHash";
    $empidStmt = $connpcs->prepare($empidQ);
    $empidStmt->execute([":userHash" => "$userHash"]);
    if ($empidStmt->rowCount() > 0) {
        $empID = $empidStmt->fetchColumn();
    }

    $userQ = "SELECT COUNT(*) FROM kdtphdb.user_permissions WHERE permission_id = 42 AND fldEmployeeNum = :empID";
    $userStmt = $connpcs->prepare($userQ);
    $userStmt->execute([":empID" => "$empID"]);
    $userCount = $userStmt->fetchColumn();
    if ($userCount > 0) {
        $groupQ = "SELECT `id`, `name`, `abbreviation`, (SELECT COUNT(*) FROM kdtphdb_new.employee_group WHERE `group_id` = `id`) as `empCount` 
        FROM kdtphdb_new.group_list HAVING `empCount` > 0 ORDER BY `name`";
        $groupStmt = $connpcs->prepare($groupQ);
        $groupStmt->execute([]);
        $groups = $groupStmt->fetchAll();
    } else {
        $groupQ = "SELECT gl.`id`, gl.`name`, gl.`abbreviation` FROM employee_group as eg LEFT JOIN group_list as gl ON eg.`group_id` = gl.`id` 
        WHERE eg.`employee_number` = :empID ";
        $groupStmt = $connnew->prepare($groupQ);
        $groupStmt->execute([":empID" => $empID]);
        $groups = $groupStmt->fetchAll();
    }

    
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($groups);
