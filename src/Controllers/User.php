<?php

namespace App\Controllers;

use App\Interfaces\DbInterface;
use App\Services\Log;
use App\Services\Response;

class User
{
    public function __construct(private readonly DbInterface $db)
    {
    }

    public function register(array $postFromJson): never
    {
        Log::init('reg');
        $login = $postFromJson[LOGIN_FOR_REGISTER_KEY_NAME];
        $password = $postFromJson[PASSWORD_FOR_REGISTER_ID];
        Log::debug("Received: login: '$login', password: '$password'");

        try {
            $registerStatus = $this->db->register($login, $password);

            if ($registerStatus === DbInterface::RESULT_SUCCESS) {
                $_SESSION[AUTHENTICATED_USER_ID] = $this->db->getUserID($login);
                Response::success();
            }

            $alertMessage = Response::getAlertMessageAtRegister($registerStatus, $login);

        } catch (\Exception $e) {
            Log::error("Exception: " . $e->getMessage());
            $alertMessage = 'There was an unforeseen error during register process';
        }

        Response::fail([NOTIFICATION => $alertMessage]);
    }

    public function login(array $postFromJson): never
    {
        Log::init('login');
        unset($_SESSION[AUTHENTICATED_USER_ID]);
        $login = $postFromJson[LOGIN_FOR_LOGIN_KEY_NAME];
        $password = $postFromJson[PASSWORD_FOR_LOGIN_ID];
        Log::debug("Received: login: '$login', password: '$password'");

        try {
            $loginStatus = $this->db->login($login, $password);

            if ($loginStatus === DbInterface::RESULT_SUCCESS) {
                $_SESSION[AUTHENTICATED_USER_ID] = $this->db->getUserID($login);
                Response::success();
            }

            $alertMessage = Response::getAlertMessageAtLogin($loginStatus, $login);

        } catch (\Exception $e) {
            Log::error("Exception: " . $e->getMessage());
            $alertMessage = 'There was an unforeseen error during login process';
        }

        Response::fail([NOTIFICATION => $alertMessage]);
    }

    public function logout(): never
    {
        Log::init('logout');
        unset($_SESSION[AUTHENTICATED_USER_ID]);
        Response::success();
    }
}