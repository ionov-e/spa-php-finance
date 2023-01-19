<?php

namespace App\Interfaces;

use App\Resources\Operation;

interface DbInterface
{
    const RESULT_SUCCESS = 0;
    const RESULT_NO_SUCH_LOGIN = 1;
    const RESULT_LOGIN_EXISTS = 2;
    const RESULT_PASSWORD_NOT_MATCHED = 3;
    const RESULT_ERROR = 8;
    const RESULT_EXCEPTION = 9;

    public function getLastTenOperations(): array;

    public function getOperationsByQuery(string $query): array;

    public function getOperationById(int $operationId): array;

    public function storeOperation(Operation $operation): bool;

    /** @return self::RESULT_* */
    public function register(string $login, string $password): int;

    /** @return self::RESULT_* */
    public function login(string $login, string $password): int;

    public function getUserID(string $login): int;
}