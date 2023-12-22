<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectkdtph.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize variables
$sendDays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
#endregion

#region main function
try {
    $expiryPassQ = "SELECT ed.emp_email as empEmail, TIMESTAMPDIFF(DAY, CURDATE(), pd.passport_expiry) AS expiringIn, pd.passport_expiry as expiringDate, pd.passport_number as 
    passportNum FROM employee_details as ed LEFT JOIN passport_details as pd ON ed.emp_number = pd.emp_number WHERE pd.passport_expiry >= CURDATE() AND pd.passport_expiry <= 
    DATE_ADD(CURDATE(), INTERVAL 9 MONTH)";
    $expiryPassStmt = $connpcs->prepare($expiryPassQ);
    $expiryPassStmt->execute([]);
    $expiryPass = $expiryPassStmt->fetchAll();

    foreach ($expiryPass as $val) {
        $expiringIn = $val["expiringIn"];
        $expiringDate = $val["expiringDate"];
        $email = $val["empEmail"];
        $passportNum = $val["passportNum"];

        if (in_array($expiringIn, $sendDays)) {
            $expiringDate = strtotime($expiringDate);
            $expiringDate = date("d M Y", $expiringDate);
            $message = "Your passport with number " . $passportNum . " will be expiring in " . $expiringDate;
            if ($expiringIn == 0) {
                $message = "Your passport with number " . $passportNum . " will be expiring today";
            }

            sendEmail($email, $expiringDate, $message);
            echo "success " . $expiringIn . " " . $email;
        } else {
            echo "fail " . $expiringIn . " " . $email;
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion


function sendEmail($email, $expiringDate, $message)
{
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: kdtexpiringpassportreminder@corp.khi.co.jp";
    $subject = 'Expiring Passport';

    mail($email, $subject, $message, $headers);
}
