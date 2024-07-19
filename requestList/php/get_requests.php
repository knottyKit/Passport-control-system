<?php
#region DB Connect
require_once '../../dbconn/dbconnectnew.php';
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/dbconnectkdtph.php';
require_once '../../global/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$result = [
    "isSuccess" => FALSE,
    "message" => "",
    "data" => array()
];
$userID = 0;
#endregion

#region get data values
$userID = getID();
if ($userID === 0) {
    $result["message"] = "Not logged in";
    die(json_encode($result));
}
$membersStatement = "";
$groupMembers = getMembers($userID);
if (count($groupMembers) > 0) {
    $implodeString = implode("','", array_values($groupMembers));
    $membersStatement = "AND `rl.emp_number` IN ('" . $implodeString . "')";
}
#endregion

#region main query
try {
    $requestQ = "SELECT rl.request_id,rl.emp_number,rl.requester_id,rl.dispatch_from,rl.dispatch_to,rl.date_requested,el.group_id FROM pcosdb.request_list rl JOIN kdtphdb_new.employee_list el ON rl.emp_number=el.id $membersStatement ORDER BY `date_requested` DESC";
    $requestStmt = $connpcs->prepare($requestQ);
    $requestStmt->execute();
    if ($requestStmt->rowCount() > 0) {
        $requestArr = $requestStmt->fetchAll();
        foreach ($requestArr as $req) {
            $output = array();
            $output["req_id"] = $req['request_id'];
            $empnum = $req['emp_number'];
            $output["emp_name"] = getName($empnum);
            $output["group_id"] = $req['group_id'];
            $requesterID = $req['requester_id'];
            $output["requester_name"] = getName($requesterID);
            $output['from'] = $req['dispatch_from'];
            $output['to'] = $req['dispatch_to'];
            $output['req_date'] = date("Y-m-d", strtotime($req['date_requested']));
            $result['data'][] = $output;
        }
        $result["isSuccess"] = TRUE;
    }
} catch (Exception $e) {
    $result["isSuccess"] = FALSE;
    $result["message"] = "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($result);
