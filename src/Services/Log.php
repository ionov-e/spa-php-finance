<?php

namespace App\Services;

use Monolog\Handler\RotatingFileHandler;
use Monolog\Level;
use Monolog\Logger;

class Log
{

    protected static Logger $instance;

    public static function init(string $channel, string $message = '', Level $level = Level::Debug): Logger
    {
        self::createLoggerIfDoesntExist($channel);

        if (empty($message)) {
            $message = "$channel has started";
        }

        self::debug($message);

        return self::$instance;
    }

    private static function getLogger(): Logger
    {
        self::createLoggerIfDoesntExist();

        return self::$instance;
    }

    private static function createLoggerIfDoesntExist(string $channel = 'uninitiated'): void
    {
        if (!isset(self::$instance)) {
            $logger = new Logger($channel);
            $logger->pushHandler(new RotatingFileHandler(LOG_PATH, LOG_MAX_DAYS));
            self::$instance = $logger;
        }
    }

    public static function debug(string $message, array $context = []): void
    {
        self::getLogger()->debug($message, $context);
    }

    public static function info(string $message, array $context = []): void
    {
        self::getLogger()->info($message, $context);
    }

    public static function notice(string $message, array $context = []): void
    {
        self::getLogger()->notice($message, $context);
    }

    public static function warning(string $message, array $context = []): void
    {
        self::getLogger()->warning($message, $context);
    }

    public static function error(string $message, array $context = []): void
    {
        self::getLogger()->error($message, $context);
    }

    public static function critical(string $message, array $context = []): void
    {
        self::getLogger()->critical($message, $context);
    }

    public static function alert(string $message, array $context = []): void
    {
        self::getLogger()->alert($message, $context);
    }

    public static function emergency(string $message, array $context = []): void
    {
        self::getLogger()->emergency($message, $context);
    }

}