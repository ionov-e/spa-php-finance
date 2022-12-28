<?php
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "global.php";

use App\Controllers;
use App\Services\DbMySQL;
use App\Services\Response;

// ----------------------- Also available for unauthenticated users
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    switch (true) { // Every method returns never
        case !empty($_POST[REGISTER_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->register();
        case !empty($_POST[LOGIN_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->login();
        case !empty($_POST[LOGOUT_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->logout();
    }

}

if (empty($_SESSION[AUTHENTICATED_USER_ID])) {
    Response::fail([UNAUTHENTICATED_KEY_NAME => 'User is unauthenticated. Please Login or Register']);
}

// ----------------------- Only for authenticated users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    switch (true) { // Every method returns never
        case !empty($_GET[SEARCH_KEY_NAME]):
            (new Controllers\Operation(new DbMySQL()))->listFilteredByQuery();
        default:
            (new Controllers\Operation(new DbMySQL()))->listAll();
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!empty($_POST[AMOUNT_KEY_NAME])) {
        (new Controllers\Operation(new DbMySQL()))->store();
    }

}

Response::reactToUnforeseenRequestFromAuthUser();