<?php
#region Functions
function checkOverlap($empnum, $range)
{
    global $connpcs;
    $isOverlap = false;
    $starttime = $range['start'];
    $endtime = $range['end'];
    $dispatchQ = "SELECT * FROM `dispatch_list` WHERE `emp_number` = 464 AND((`dispatch_from` BETWEEN :starttime AND :endtime OR `dispatch_to` BETWEEN :starttime AND :endtime) OR(:starttime BETWEEN `dispatch_from` AND `dispatch_to` OR :endtime BETWEEN `dispatch_from` AND `dispatch_to`))";
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
    global $connnew;
    $members = array();
    $yearMonth = date("Y-m-01");
    $myGroups = getGroups($empnum);
    foreach ($myGroups as $grp) {
        $memsQ = "SELECT `id` FROM `employee_list` WHERE `group_id` = :grp AND (`resignation_date` IS NULL OR `resignation_date` = '0000-00-00' OR `resignation_date` > :yearMonth) 
        AND `nickname` <> ''";
        $memsStmt = $connnew->prepare($memsQ);
        $memsStmt->execute([":grp" => $grp, ":yearMonth" => $yearMonth]);
        if ($memsStmt->rowCount() > 0) {
            $memArr = $memsStmt->fetchAll();
            $arrValues = array_column($memArr, "id");
            $members = array_merge($members, $arrValues);
        }
    }
    return $members;
}
function getGroups($empnum)
{
    global $connnew;
    $allGroupAccess = alLGroupAccess($empnum);
    $myGroups = array();
    if (!$allGroupAccess) {
        $groupsQ = "SELECT `group_id` FROM `employee_group` WHERE `employee_number` = :empnum";
        $groupsStmt = $connnew->prepare($groupsQ);
        $groupsStmt->execute([":empnum" => $empnum]);
        if ($groupsStmt->rowCount() > 0) {
            $groupArr = $groupsStmt->fetchAll();
            foreach ($groupArr as $grp) {
                $group = $grp['group_id'];
                array_push($myGroups, $group);
            }
        }
    }
    return $myGroups;
}
function getID()
{
    global $connpcs;
    $empID = 0;

    if (!empty($_COOKIE["userID"])) {
        $userHash = $_COOKIE["userID"];
    }
    $empidQ = "SELECT fldEmployeeNum as empID FROM kdtphdb.kdtlogin WHERE fldUserHash = :userHash";
    $empidStmt = $connpcs->prepare($empidQ);
    $empidStmt->execute([":userHash" => "$userHash"]);
    if ($empidStmt->rowCount() > 0) {
        $empID = $empidStmt->fetchColumn();
    }
    return $empID;
}
function getName($id)
{
    global $connnew;
    global $connpcs;
    $name = '';
    $newQ = "SELECT CONCAT(`surname`,', ',`firstname`) FROM `employee_list` WHERE `id`=:id";
    $newStmt = $connnew->prepare($newQ);
    $newStmt->execute([":id" => $id]);
    if ($newStmt->rowCount() > 0) {
        $name = $newStmt->fetchColumn();
    } else {
        $pcsQ = "SELECT CONCAT(`surname`,', ',`firstname`) FROM `khi_details` WHERE `number`=:id";
        $pcsStmt = $connpcs->prepare($pcsQ);
        $pcsStmt->execute([":id" => $id]);
        if ($pcsStmt->rowCount() > 0) {
            $name = $pcsStmt->fetchColumn();
        }
    }

    return ucwords(strtolower($name));
}
#endregion
