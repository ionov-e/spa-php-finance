<?php

namespace App\Controllers;

use App\Interfaces\DbInterface;
use App\Services\Input;
use App\Services\Log;
use App\Services\Response;
use UnexpectedValueException;

class Operation
{

    public function __construct(private readonly DbInterface $db)
    {
    }

    public function listAll(): never
    {
        Log::init('opList');

        try {
            $operations = $this->db->getLastTenOperations();
            Response::success(['operations' => $operations]);
        } catch (\Exception $e) {
            Log::error("Exception: {$e->getMessage()}");
            Response::error('Unforeseen error');
        }
    }


    public function listFilteredByQuery(): never
    {
        Log::init('opListQuery');

        try {
            $query = Input::getQueryFromGet();
            $operations = $this->db->getOperationsByQuery($query);
            Response::success(['operations' => $operations, 'query' => $query, 'count' => count($operations)]);
        } catch (\Exception $e) {
            Log::error("Exception: {$e->getMessage()}");
            Response::error('Unforeseen error');
        }
    }

    public function store(array $postFromJson): never
    {
        Log::init('opStore');

        try {
            $operationResource = \App\Resources\Operation::createFromArray($postFromJson);
            $this->db->storeOperation($operationResource);
            Response::success();
        } catch (UnexpectedValueException $e) {
            Log::info("Invalid input: {$e->getMessage()}");
            Response::fail([NOTIFICATION => "Please correct your input, we've got an error: {$e->getMessage()}"]);
        } catch (\Throwable $e) {
            Log::error("Throwable: {$e->getMessage()}");
            Response::error('Unforeseen error');
        }

    }

    public function delete(array $postFromJson): never
    {
        Log::init('opDel');

        try {
            $operationId = Input::getDeleteOperationId($postFromJson);
            $this->db->deleteOperation($operationId);
            Response::success();
        } catch (UnexpectedValueException $e) {
            Log::info("Invalid input: {$e->getMessage()}");
            Response::fail([NOTIFICATION => "Please correct your input, we've got an error: {$e->getMessage()}"]);
        } catch (\Throwable $e) {
            Log::error("Throwable: {$e->getMessage()}");
            Response::error('Unforeseen error');
        }
    }

    public function showByID(): never
    {
        Log::init('opShowById');

        try {
            $operationId = Input::getOperationIdFromGet();

            $operation = $this->db->getOperationById($operationId);

            Response::success($operation);
        } catch (UnexpectedValueException $e) {
            Log::info("Invalid input: {$e->getMessage()}");
            Response::fail([NOTIFICATION => "Invalid input: {$e->getMessage()}"]);
        } catch (\Exception $e) {
            Response::error('');
        }
    }
}
