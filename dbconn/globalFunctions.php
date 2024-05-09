<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectkdtph.php';
#endregion
#region Functions
function checkOverlap($empnum, $range)
{
    global $connpcs;
    $isOverlap = false;
    $starttime = $range['start'];
    $endtime = $range['end'];
    $dispatchQ = "SELECT * FROM `dispatch_list` WHERE `emp_number` = :empnum AND `dispatch_from` <= :starttime AND `dispatch_to` >= :endtime";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":empnum" => $empnum, ":starttime" => $starttime, ":endtime" => $endtime]);
    if ($dispatchStmt->rowCount() > 0) {
        $isOverlap = true;
    }

    return $isOverlap;
}
function checkAccess($empnum)
{
    global $connkdt;
    $access = FALSE;
    $permissionID = 36;
    $userQ = "SELECT COUNT(*) FROM user_permissions WHERE permission_id = :permissionID AND fldEmployeeNum = :empID";
    $userStmt = $connkdt->prepare($userQ);
    $userStmt->execute([":empID" => $empnum, ":permissionID" => $permissionID]);
    $userCount = $userStmt->fetchColumn();
    if ($userCount > 0) {
        $access = TRUE;
    }
    return $access;
}
function checkEditAccess($empnum)
{
    global $connkdt;
    $access = FALSE;
    $permissionID = 37;
    $userQ = "SELECT COUNT(*) FROM user_permissions WHERE permission_id = :permissionID AND fldEmployeeNum = :empID";
    $userStmt = $connkdt->prepare($userQ);
    $userStmt->execute([":empID" => $empnum, ":permissionID" => $permissionID]);
    $userCount = $userStmt->fetchColumn();
    if ($userCount > 0) {
        $access = TRUE;
    }
    return $access;
}
#endregion
