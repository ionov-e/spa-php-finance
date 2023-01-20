<?php

namespace App\Services;

use UnexpectedValueException;

class Input
{
    public static function getArrayFromJsonPost(): array
    {
        if (!$postInput = file_get_contents('php://input')) {
            return [];
        }

        if (!$decodedJson = json_decode($postInput, true)) {
            Log::error("Failed to json_decode received 'php://input': " . $postInput);
            return [];
        }

        Log::debug("json_decoded from 'php://input'" . json_encode($decodedJson));
        return $decodedJson;
    }

    public static function getOperationIdFromGet(): int
    {
        return self::getInt($_GET[OPERATION_ID_KEY_NAME]);
    }

    public static function getDeleteOperationId(array $postFromJson): int
    {
        return self::getInt($postFromJson[DELETE_OPERATION_ID]);
    }

    private static function getInt($operationId): int
    {
        $defaultErrorMessage = 'ID should be a positive number';

        if (!is_string($operationId)) {
            Log::debug("Provided operation ID is not a string: " . json_encode($operationId));
            throw new UnexpectedValueException($defaultErrorMessage);
        }

        Log::debug("Operation ID received: {$operationId}");

        if (!is_numeric(trim($operationId))) {
            throw new UnexpectedValueException($defaultErrorMessage);
        }

        $operationId = (int)$operationId;

        if ($operationId <= 0) {
            throw new UnexpectedValueException($defaultErrorMessage);
        }

        return $operationId;
    }

    public static function getQueryFromGet(): string
    {

        if (!is_string($query = $_GET[SEARCH_KEY_NAME])) {
            Log::debug("Query is not a string: " . json_encode($query));
            throw new UnexpectedValueException('');
        }

        $query = trim($query);

        Log::debug("Query received: $query");

        return $query;
    }
}
