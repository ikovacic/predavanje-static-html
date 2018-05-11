<?php

    header('Content-Type: application/json');

    $config = array(
        'email-to' => 'ikovacic1@gmail.com',
        'email-subject' => 'Web Inquiry'
    );

    $fields = array(
        'title' => array(
            'param' => 'msg-title',
            'is-required' => false,
            'leave-empty' => true
        ),
        'name' => array(
            'param' => 'msg-name',
            'is-required' => true,
            'leave-empty' => false
        ),
        'email' => array(
            'param' => 'msg-email',
            'is-required' => true,
            'leave-empty' => false
        ),
        'country' => array(
            'param' => 'msg-country',
            'is-required' => false,
            'leave-empty' => false
        ),
        'telephone' => array(
            'param' => 'msg-telephone',
            'is-required' => false,
            'leave-empty' => false
        ),
        'text' => array(
            'param' => 'msg-text',
            'is-required' => true,
            'leave-empty' => false
        )
    );

    $emailExp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

    $invalidFields = array();
    $emailFields = array();

    foreach($fields as $k => $field) {

        $paramName = $field['param'];

        // Access without all parameters
        if(!isset($_POST[$paramName])) {
            echo '{"status":100}';
            die;
        } else {

            // Honeypot
            if($field['leave-empty'] && $_POST[$paramName] != '') {
                echo '{"status":200}';
                die;
            }

            // Is empty or wrogn email
            if(
                ($field['is-required'] && $_POST[$paramName] == '') ||
                ($k == 'email' && !preg_match($emailExp, $_POST[$paramName]))
            ) {
                $invalidFields[] = '#' . $field['param'];
            }

            $emailFields[$k] = $_POST[$paramName];
        }
    }

    if(count($invalidFields)) {
        echo '{"status":300,"fields":'.json_encode($invalidFields).'}';
        die;
    }      


    $messageText = '
        <html>
            <head>
                <title>'.$config['email-subject'].'</title>
            </head>
            <body>
                <p>
                    Name: '.$emailFields['name'].'<br>
                    Email: '.$emailFields['email'].'<br>
                    Country: '.$emailFields['country'].'<br>
                    Telephone: '.$emailFields['telephone'].'
                </p>
                <p>Message:<br>'.$emailFields['text'].'</p>
            </body>
        </html>';


    // Create email headers

    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8" . "\r\n";

    $headers .= "From: web@hd-travel.hr"."\r\n";
    $headers .= "Reply-To: ".$emailFields['name']." <".$emailFields["email"].">\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if(mail($config['email-to'], $config['email-subject'], $messageText, $headers) == true) {
        echo '{"status":400}';
    } else {
        echo '{"status":500}';
    }

?>
