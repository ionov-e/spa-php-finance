<?php
/** Provides JSend type of response ( https://github.com/omniti-labs/jsend ) */

namespace App\Services;

use App\Interfaces\DbInterface;

class Response
{
    private const STATUS_SUCCESS = 'success';   // Required keys: status, data
    private const STATUS_FAIL = 'fail';         // Required keys: status, data
    private const STATUS_ERROR = 'error';       // Required keys: status, message.   Optional: data

    public static function success(array $data = null): never
    {
        self::response(self::STATUS_SUCCESS, $data);
    }

    public static function fail(array $data): never
    {
        self::response(self::STATUS_FAIL, $data);
    }

    public static function error(string $error, array $data = null): never
    {
        self::response(self::STATUS_ERROR, $data, $error);
    }

    /**
     * @param self::STATUS_* $status
     * @param array|null $data
     * @param string $error
     */
    private static function response(string $status, array $data = null, string $error = ''): never
    {
        $return = ["status" => $status];

        if ($status !== self::STATUS_ERROR || !is_null($data)) {
            $return = array_merge($return, ['data' => $data]);
        }

        if ($status === self::STATUS_ERROR) {
            $return = array_merge($return, ['message' => $error]);
        }

        echo json_encode($return);
        exit(0);
    }

    public static function getAlertMessageAtLogin(int $loginStatus, mixed $login): string
    {
        $defaultErrorMessage = 'There was an unforeseen error during login process';

        switch ($loginStatus) {
            case DbInterface::RESULT_PASSWORD_NOT_MATCHED:
                return "Password didn't matched";
            case DbInterface::RESULT_NO_SUCH_LOGIN:
                return "User with login $login hasn't been found";
            case DbInterface::RESULT_EXCEPTION:
                return $defaultErrorMessage;
            default:
                Log::critical("Unforeseen login status: $loginStatus");
                return $defaultErrorMessage;
        }
    }

    public static function getAlertMessageAtRegister(mixed $registerStatus, mixed $login): string
    {
        $defaultErrorMessage = 'There was an unforeseen error during register process';

        switch ($registerStatus) {
            case DbInterface::RESULT_LOGIN_EXISTS:
                return "User with login '$login' already exists";
            case DbInterface::RESULT_ERROR:
                return $defaultErrorMessage;
            default:
                Log::critical("Unforeseen login status: $registerStatus");
                return $defaultErrorMessage;
        }

    }

    public static function reactToUnforeseenRequestFromAuthUser(): never
    {
        Log::init('weird');
        $message = '';

        if (!empty($_POST)) {
            $message .= 'Post content: ' . json_encode($_POST, JSON_UNESCAPED_UNICODE);
        }

        if (!empty($_POST) && !empty($_GET)) {
            $message .= PHP_EOL;
        }

        if (!empty($_GET)) {
            $message .= 'Get content : ' . json_encode($_GET, JSON_UNESCAPED_UNICODE);
        }

        Log::warning($message);

        Response::error('Unforeseen request');
    }
}