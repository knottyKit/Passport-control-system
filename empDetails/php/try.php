<?php

$version = date("YmdHis");
$yearNow = date("Y");
$picLink = "C:/xampp/htdocs/QMS/Profilev2/" . $yearNow . "/pic_" . $empDeets["id"] . ".jpg";
$empDeets = "http://kdt-ph/QMS/Profilev2/2023/pic_10.jpg?version=" . $version;
if(!file_exists($picLink)) {
    $empDeets = "http://kdt-ph/QMS/Profilev2/2023/defaulqmsphoto.png";
}

echo $empDeets;
$yearNow = date("Y");
for($x = $yearNow; $x >= 2021; $x--) {
    echo $x;
}