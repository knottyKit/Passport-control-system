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
function alLGroupAccess($empnum)
{
    global $connkdt;
    $access = FALSE;
    $permissionID = 42;
    $userQ = "SELECT COUNT(*) FROM user_permissions WHERE permission_id = :permissionID AND fldEmployeeNum = :empID";
    $userStmt = $connkdt->prepare($userQ);
    $userStmt->execute([":empID" => $empnum, ":permissionID" => $permissionID]);
    $userCount = $userStmt->fetchColumn();
    if ($userCount > 0) {
        $access = TRUE;
    }
    return $access;
}
function getMembers($empnum)
{
    global $connkdt;
    $members = array();
    $yearMonth = date("Y-m-01");
    $myGroups = getGroups($empnum);
    foreach ($myGroups as $grp) {
        $memsQ = "SELECT fldEmployeeNum FROM emp_prof WHERE fldGroup=:grp AND fldEmployeeNum <> :empnum AND (fldResignDate IS NULL OR fldResignDate ='0000-00-00' OR fldResignDate > :yearMonth) AND fldNick<>''";
        $memsStmt = $connkdt->prepare($memsQ);
        $memsStmt->execute([":empnum" => $empnum, ":grp" => $grp, ":yearMonth" => $yearMonth]);
        if ($memsStmt->rowCount() > 0) {
            $memArr = $memsStmt->fetchAll();
            $arrValues = array_column($memArr, "fldEmployeeNum");
            $members = array_merge($members, $arrValues);
        }
    }
    return $members;
}
function getGroups($empnum)
{
    global $connkdt;
    $allGroupAccess = alLGroupAccess($empnum);
    $myGroups = array();
    if (!$allGroupAccess) {
        $groupsQ = "SELECT fldGroup, fldGroups FROM emp_prof WHERE fldEmployeeNum=:empnum";
        $groupsStmt = $connkdt->prepare($groupsQ);
        $groupsStmt->execute([":empnum" => $empnum]);
        if ($groupsStmt->rowCount() > 0) {
            $groupArr = $groupsStmt->fetch();
            if ($groupArr["fldGroups"] != '') {
                $myGroups = explode("/", $groupArr["fldGroups"]);
            } else {
                array_push($myGroups, $groupArr["fldGroup"]);
            }
        }
    }
    return $myGroups;
}
#endregion
