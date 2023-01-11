<?php
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "global.php";

use \App\Services\Response;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SPA. Finance</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <link rel="stylesheet" href="https://unpkg.com/flowbite@1.5.5/dist/flowbite.min.css"/>
</head>
<body>

<div id="container" class="flex flex-col overflow-hidden container mx-auto py-2 sm:px-6 lg:px-8">
</div>

<script src="https://unpkg.com/flowbite@1.5.5/dist/flowbite.js"></script>
<script>
    const LOGIN_FORM_ID = 'login-form'
    const REGISTER_FORM_ID = 'register-form'
    const LOGIN_BUTTON_ID = 'login-button'
    const REGISTER_BUTTON_ID = 'register-button'
    const LOGIN_LOGIN_ID = '<?= LOGIN_FOR_LOGIN_KEY_NAME ?>'
    const REGISTER_LOGIN_ID = '<?= LOGIN_FOR_REGISTER_KEY_NAME ?>'
    const PASSWORD_FOR_LOGIN_ID = '<?= PASSWORD_FOR_LOGIN_ID ?>'
    const PASSWORD_FOR_REGISTER_ID = '<?= PASSWORD_FOR_REGISTER_ID ?>'
    const PASSWORD_REPEAT_FOR_REGISTER_ID = PASSWORD_FOR_REGISTER_ID + '-repeat'
    const STATUS_SUCCESS = '<?= Response::STATUS_SUCCESS ?>'
    const STATUS_FAIL = '<?= Response::STATUS_FAIL ?>'
    const STATUS_ERROR = '<?= Response::STATUS_ERROR ?>'
    const NOTIFICATION = '<?= NOTIFICATION ?>'
</script>
<script src="/assets/js/finance.js"></script>
</body>
</html>