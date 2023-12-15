<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

$groups = array();

#endregion

#region main query
try {
    $groupQ = "SELECT group_id,group_abbr FROM `group_list` ORDER BY group_abbr";
    $groupStmt = $connpcs->query($groupQ);

    if ($groupStmt->rowCount() > 0) {
        $grouparr = $groupStmt->fetchAll();
        foreach ($grouparr as $grp) {
            $output = array();
            $name = $grp['group_abbr'];
            $id = $grp['group_id'];
            $output += ["name" => $name];
            $output += ["id" => $id];
            array_push($groups, $output);
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

#endregion

#region FUNCTIONS

#endregion
echo json_encode($groups);
