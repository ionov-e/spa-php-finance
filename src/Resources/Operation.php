<?php

namespace App\Resources;

use App\Services\Log;
use UnexpectedValueException;

class Operation
{
    private function __construct(
        public bool   $isIncome,
        public float  $amount,
        public string $comment
    )
    {
    }

    /** @throws UnexpectedValueException */
    public static function createFromArray(array $array): self
    {
        Log::info("Post-content: " . json_encode($array));

        $isIncome = $array[IS_INCOME_KEY_NAME];
        $amount = $array[AMOUNT_KEY_NAME];
        $comment = $array[COMMENT_KEY_NAME];

        if (!is_string($comment) || strlen($comment) > 60 || strlen($comment) === 0) {
            throw new UnexpectedValueException("Comment should be a not empty string, less than 60 symbols");
        }

        if (!is_numeric($amount)) {
            throw new UnexpectedValueException('Amount should be a number');
        }

        $amount = (float)$amount;

        if ($amount <= 0) {
            throw new UnexpectedValueException('Amount should be a positive number');
        }

        if (!is_bool($isIncome)) {
            throw new UnexpectedValueException(IS_INCOME_KEY_NAME . ' parameter should be true or false');
        }

        Log::debug("PostResource content: [$isIncome, $amount, $comment]");

        return new self($isIncome, $amount, $comment);
    }
}