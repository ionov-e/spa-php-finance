<?php
require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "global.php";

session_start();
header('Content-Type: application/json; charset=utf-8');

use App\Controllers;
use App\Services\DbMySQL;
use App\Services\Response;
use App\Services\Input;


// ----------------------- Also available for unauthenticated users
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $postFromJson = Input::getArrayFromJsonPost();

    switch (true) { // Every method returns never
        case !empty($postFromJson[LOGIN_FOR_REGISTER_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->register($postFromJson);
        case !empty($postFromJson[LOGIN_FOR_LOGIN_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->login($postFromJson);
        case !empty($postFromJson[LOGOUT_KEY_NAME]):
            (new Controllers\User(new DbMySQL()))->logout();
    }

}

if (empty($_SESSION[AUTHENTICATED_USER_ID])) {
    Response::fail([UNAUTHENTICATED_KEY_NAME => 'User is unauthenticated. Please Login or Register']);
}

// ----------------------- Only for authenticated users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    switch (true) { // Every method returns never
        case !empty($_GET[OPERATION_ID_KEY_NAME]):
            (new Controllers\Operation(new DbMySQL()))->showByID();
        case !empty($_GET[SEARCH_KEY_NAME]):
            (new Controllers\Operation(new DbMySQL()))->listFilteredByQuery();
        default:
            (new Controllers\Operation(new DbMySQL()))->listAll();
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!empty($postFromJson[AMOUNT_KEY_NAME])) {
        (new Controllers\Operation(new DbMySQL()))->store($postFromJson);
    } elseif (!empty($postFromJson[DELETE_OPERATION_ID])) {
        (new Controllers\Operation(new DbMySQL()))->delete($postFromJson);
    }

}

Response::reactToUnforeseenRequestFromAuthUser();
