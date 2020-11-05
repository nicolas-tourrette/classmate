<?php

header("Content-Type: application/json");

require_once __DIR__.'/../src/dao/dao-appointments.php';

/**
 * Mailer
 */
require_once __DIR__.'/../lib/phpmailer/src/Exception.php';
require_once __DIR__.'/../lib/phpmailer/src/PHPMailer.php';
require_once __DIR__.'/../lib/phpmailer/src/SMTP.php';
require_once __DIR__.'/../lib/phpmailer/language/phpmailer.lang-fr.php';

// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if(isset($_GET["action"])){
    switch ($_GET["action"]) {
        case 'book':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                $appointment = new BookedAppointment($data["appointment"]);
                $appointment = DAOAppointment::book($appointment);
                $mail = new PHPMailer(true);

                try {
                    //Server settings
                    //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
                    $mail->setLanguage('fr', __DIR__.'/../lib/phpmailer/language/phpmailer.lang-fr.php');
                    $mail->isSMTP();                                            // Send using SMTP
                    $mail->Host       = 'smtp.server.com';                         // Set the SMTP server to send through
                    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
                    $mail->Username   = 'username@server.com';             // SMTP username
                    $mail->Password   = 'password';                          // SMTP password
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
                    $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
                    $mail->CharSet    = 'UTF-8';                                // Uses UTF-8 encoding format for the mail

                    //Recipients
                    $mail->setFrom("emailfrom@server.com", "Marion PELTE");
                    $mail->addAddress($appointment->getParentEmail(), "M. ou Mme ".$appointment->getParentName());     // Add a recipient
                    $mail->addReplyTo("emailfrom@server.com", "Marion PELTE");
                    //$mail->addCC('cc@example.com');
                    $mail->addBCC('emailfrom@server.com');

                    // Attachments
                    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
                    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

                    // Content
                    $mail->isHTML(true);                                  // Set email format to HTML
                    $mail->Subject = "Confirmation de rendez-vous";
                    $mail->Body =  "<p>Bonjour M. ou Mme ".$appointment->getParentName().",</p>";
                    $mail->Body .= "<p>Je vous confirme le rendez-vous pris avec moi sur Classmate pour le sondage \"".urldecode($_GET["poll"])."\". Nous nous rencontrerons donc le <b>".$appointment->getStart()->format("d/m/Y à H:i")."</b>.</p>";
                    $mail->Body .= "<p>Bien cordialement,</p>";
                    $mail->Body .= "<p>Mme PELTE<br><i>Enseignante de CM2 A - École privée Sainte Marie - Auxerre</i></p>";

                    $mail->send();
                }
                catch (Exception $e) {
                    header("HTTP/1.0 ".$e->getCode()." Error: ".$e->getMessage());
                    throw $e;
                }

                echo json_encode(array('id' => $appointment->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;
        
        case 'add':
            if(isset($_POST["data"]) && isset($_GET["pollId"])){
                $data = json_decode($_POST["data"], true);
                $appointment = new BookedAppointment($data["appointment"]);
                $appointment = DAOAppointment::add($_GET["pollId"], $appointment);
                echo json_encode(array('id' => $appointment->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;

        case 'edit':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                $appointment = new BookedAppointment($data["appointment"]);
                $appointment = DAOAppointment::edit($appointment);
                echo json_encode(array('id' => $appointment->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;

        case 'delete':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                echo DAOAppointment::delete($data["id"]);
            }
            else{
                echo false;
            }
            break;

        default:
            throw new Exception("Specified action is unknown.");
            break;
    }
}
else{
    throw new Exception("You have not specified any action.");
}