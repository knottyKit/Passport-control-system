<?php

require "../dbconn/dbconnectkdtph.php";
require "./dbconnect.php";

$getEmployees = "SELECT ep.`fldEmployeeNum`, ep.`fldSurname`, ep.`fldFirstname`, ep.`fldNick`, ep.`fldUser`, ep.`fldGroup`, ep.`fldGroups`, ep.`fldDesig`, ep.`fldBirthDate`, 
ep.`fldGender`, ep.`fldStatus`, ep.`fldDateHired`, ep.`fldActive`, ep.`fldResignDate`, kl.`fldOutlook` FROM `emp_prof` as ep LEFT JOIN `kdtlogin` as kl ON
ep.`fldEmployeeNum` = kl.`fldID` GROUP BY ep.`fldEmployeeNum`";
$getEmployeesStmt = $connkdt->query($getEmployees);
$employees = $getEmployeesStmt->fetchAll();

$truncateEL = "TRUNCATE TABLE `employee_list`";
$truncateELStmt = $connkdtn->prepare($truncateEL);
$truncateELStmt->execute();

$truncateEG = "TRUNCATE TABLE `employee_group`";
$truncateEGStmt = $connkdtn->prepare($truncateEG);
$truncateEGStmt->execute();

foreach($employees as $emp) {
    $id = $emp['fldEmployeeNum'];
    $surname = $emp['fldSurname'];
    $firstname = $emp['fldFirstname'];
    $nickname = $emp['fldNick'];
    $username = $emp['fldUser'];
    $email = $emp['fldOutlook'];
    $group = $emp['fldGroup'];
    $groups = $emp['fldGroups'];
    $designation = $emp['fldDesig'];
    $birthday = $emp['fldBirthDate'];
    $gender = $emp['fldGender'];
    $mstatus = $emp['fldStatus'];
    $datehired = $emp['fldDateHired'];
    $active = $emp['fldActive'];
    $resigndate = $emp['fldResignDate'];

    if($gender == "M") {
        $gender = 0;
    } else if($gender == "F") {
        $gender = 1;
    } else {
        $gender = 2;
    }

    if($mstatus == "Married") {
        $mstatus = 1;
    } else {
        $mstatus = 0;
    }

    if(!empty($group) && $group != "-") {
        $groupIDSel = "SELECT `id` FROM `group_list` WHERE `abbreviation` = :group";
        $groupIDStmt = $connkdtn->prepare($groupIDSel);
        $groupIDStmt->execute([":group" => "$group"]);
        $groupID = $groupIDStmt->fetchColumn();
    } else {
        $groupID = 0;
    }

    if(!empty($designation) && $designation != "-") {
        $getDesig = "SELECT `id` FROM `designation_list` WHERE `acronym` = :designation";
        $getDesigStmt = $connkdtn->prepare($getDesig);
        $getDesigStmt->execute([":designation" => "$designation"]);
        $desigID = $getDesigStmt->fetchColumn();
    } else {
        $desigID = 0;
    }

    $insertEmp = "INSERT IGNORE INTO `employee_list`(`id`, `surname`, `firstname`, `nickname`, `username`, `email`, `group_id`, `designation`, `birthdate`, `gender`, 
    `marital_status`, `date_hired`, `emp_status`, `resignation_date`) VALUES (:id, :surname, :firstname, :nickname, :username, :email, :groupID, :desigID, 
    :birthday, :gender, :mstatus, :datehired, :active, :resigndate)";
    $insertEmpStmt = $connkdtn->prepare($insertEmp);
    $insertEmpStmt->execute([":id" => "$id", ":surname" => "$surname", ":firstname" => "$firstname", ":nickname" => "$nickname", ":username" => "$username", 
    ":email" => "$email", ":groupID" => "$groupID", ":desigID" => "$desigID", ":birthday" => "$birthday", ":gender" => "$gender", ":mstatus" => "$mstatus", 
    ":datehired" => "$datehired", ":active" => "$active", ":resigndate" => "$resigndate"]);

    if(!empty($groups) && $groups != "-") {
        $groups = explode("/", $groups);
        foreach($groups as $gname) {
            $getgID = "SELECT `id` FROM `group_list` WHERE `abbreviation` = :gname";
            $getgIDStmt = $connkdtn->prepare($getgID);
            $getgIDStmt->execute([":gname" => "$gname"]);
            $gID = $getgIDStmt->fetchColumn();

            $insertgID = "INSERT IGNORE INTO `employee_group`(`employee_number`, `group_id`) VALUES (:id, :gID)";
            $insertgIDStmt = $connkdtn->prepare($insertgID);
            $insertgIDStmt->execute([":id" => "$id", ":gID" => "$gID"]);
        }
    }



    
}


?>