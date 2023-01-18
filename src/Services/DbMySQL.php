<?php

namespace App\Services;

use PDO;
use App\Interfaces\DbInterface;
use App\Resources\Operation;

class DbMySQL implements DbInterface
{
    private PDO $pdo;

    public function __construct()
    {
        try {
            $dbConnectionDsnString = "mysql:host=" . MYSQL_SERVER_NAME . ";dbname=" . MYSQL_DATABASE;
            $dbConnection = new PDO($dbConnectionDsnString, MYSQL_USER, MYSQL_PASSWORD);
            $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo = $dbConnection;
        } catch (\Throwable $e) {
            throw new \PDOException("Connection failed. Throwable name: '" . $e::class . "'. Message : " . $e->getMessage());
        }
    }

    public function getOperations(): array
    {
        return $this->pdo->query("SELECT * FROM operations")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOperationsByQuery(string $query): array
    {
        $sql = "SELECT * FROM operations WHERE comment LIKE CONCAT('%', :query, '%')";
        $sth = $this->pdo->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute(['query' => $query]);
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOperationById(int $operationId): array
    {
        $sql = "SELECT * FROM operations WHERE id = :id";
        $sth = $this->pdo->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute(['id' => $operationId]);
        return $sth->fetch(PDO::FETCH_ASSOC);
    }

    public function register(string $login, string $password): int
    {
        Log::debug(__METHOD__ . " has been started");

        try {
            $userArrayFromDb = $this->getUserRow($login);

            if ($userArrayFromDb) {
                Log::debug("Login '$login' already exists. Contend: " . json_encode($userArrayFromDb));
                return DbInterface::RESULT_LOGIN_EXISTS;
            }

            if ($this->storeUser($login, $password)) {
                return DbInterface::RESULT_SUCCESS;
            }

        } catch (\Exception $e) {
            Log::error("Exception: " . $e->getMessage());
        }

        Log::error("Couldn't create user in DB: Login '$login', Password '$password'");
        return DbInterface::RESULT_ERROR;
    }

    private function storeUser(string $login, string $password): bool
    {
        Log::debug(__METHOD__ . " has been started");

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (login, password_hashed) VALUES (?,?)";

        return $this->pdo->prepare($sql)->execute([$login, $passwordHash]);
    }

    public function storeOperation(Operation $operation): bool
    {
        Log::debug(__METHOD__ . " has been started");

        $sql = "INSERT INTO operations (is_income, amount, comment) VALUES (?,?,?)";

        return $this->pdo->prepare($sql)->execute([$operation->isIncome, $operation->amount, $operation->comment]);
    }

    public function login(string $login, string $password): int
    {
        Log::debug(__METHOD__ . " has been started");

        try {
            $userArrayFromDb = $this->getUserRow($login);

            if (!$userArrayFromDb) {
                Log::info("User '$login' hasn't been found in DB");
                return DbInterface::RESULT_NO_SUCH_LOGIN;
            }

            Log::debug("For user '$login' fetched from DB row: " . json_encode($userArrayFromDb));

            if (!password_verify($password, $userArrayFromDb[PASSWORD_HASHED_KEY_NAME])) {
                return DbInterface::RESULT_PASSWORD_NOT_MATCHED;
            }

            return DbInterface::RESULT_SUCCESS;
        } catch (\Exception $e) {
            Log::error("Login Exception: " . json_encode($e->getMessage()));
            return DbInterface::RESULT_EXCEPTION;
        }
    }

    public function getUserID(string $login): int
    {
        $userArrayFromDb = $this->getUserRow($login);

        if (empty($userId = $userArrayFromDb[ID_KEY_NAME])) {
            Log::critical("Couldn't find ID for user '$login'");
            return 0;
        }

        return (int)$userId;
    }

    private function getUserRow(string $login): array|false
    {
        $sql = sprintf('SELECT * FROM users WHERE %s = :login', LOGIN_FOR_LOGIN_KEY_NAME);
        $sth = $this->pdo->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
        $sth->execute(['login' => $login]);
        return $sth->fetch(PDO::FETCH_ASSOC);
    }
}