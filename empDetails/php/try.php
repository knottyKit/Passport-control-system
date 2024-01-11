<?php

$version = date("YmdHis");
$picLink = "../EmployeesFolder/8/picture.jpg";
$empDeets = $picLink . "?version=" . $version;
if(!file_exists($picLink)) {
    $empDeets = "./EmployeesFolder/defaultqmsphoto.png";
}

echo $empDeets;