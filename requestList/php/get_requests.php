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
    $requestQ = "SELECT rl.request_id,rl.emp_number,rl.requester_id,rl.dispatch_from,rl.dispatch_to,rl.date_requested,el.group_id,pd.passport_expiry,vd.visa_expiry,rl.request_status FROM pcosdb.request_list rl JOIN kdtphdb_new.employee_list el ON rl.emp_number=el.id LEFT JOIN `passport_details` 
    AS pd ON pd.emp_number=el.id  LEFT JOIN `visa_details` AS vd ON vd.emp_number=el.id WHERE rl.emp_number != 513 $membersStatement ORDER BY `date_requested` DESC LIMIT 10";
    $requestStmt = $connpcs->prepare($requestQ);
    $requestStmt->execute();
    if ($requestStmt->rowCount() > 0) {
        $requestArr = $requestStmt->fetchAll();
        foreach ($requestArr as $req) {
            $output = array();
            $passValidity = false;
            $visaValidity = false;
            $output["req_id"] = $req['request_id'];
            $empnum = $req['emp_number'];
            $output["emp_name"] = getName($empnum);
            $output["group_id"] = $req['group_id'];
            $requesterID = $req['requester_id'];
            $output["requester_name"] = getName($requesterID);
            $output['from'] = $req['dispatch_from'];
            $to = $req['dispatch_to'];
            $output['to'] = $to;
            $output['req_date'] = date("Y-m-d", strtotime($req['date_requested']));
            $passExp = $req['passport_expiry'];
            $visaExp = $req['visa_expiry'];
            if ($passExp && (strtotime($passExp) >= strtotime($to))) {
                $passValidity = true;
            }
            if ($visaExp && (strtotime($visaExp) >= strtotime($to))) {
                $visaValidity = true;
            }
            $output["passValid"] = $passValidity;
            $output["visaValid"] = $visaValidity;
            // $status = ($req['request_status'] === NULL) ? "Pending" : (($req['request_status'] === 1) ? "Approved" : "Denied");
            $status = $req['request_status'];
            $output['status'] = $status;
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
