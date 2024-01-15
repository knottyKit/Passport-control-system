<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$yearNow = date('Y');
$years = array();
#endregion

#region main query
try {
    $yearQ = "SELECT YEAR(dispatch_from) as dispatch_from, YEAR(dispatch_to) as dispatch_to FROM dispatch_list GROUP BY YEAR(dispatch_from), YEAR(dispatch_to)";
    $yearStmt = $connpcs->query($yearQ);
    $yearStmt->execute([]);
    $allYears = $yearStmt->fetchAll();

    foreach ($allYears as $val) {
        $from = $val["dispatch_from"];
        $to = $val["dispatch_to"];

        checkYear($from);
        checkYear($to);
    }

    if(!in_array($yearNow, $years)) {
        array_push($years, $yearNow);
    }
    sort($years);

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($years);

#region function
function checkYear($year) {
    global $years;

    if(!in_array($year, $years)) {
        array_push($years, $year);
    }
}
#endregion