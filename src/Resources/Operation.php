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
    public static function createFromPost(): self
    {
        Log::info("Post-content: " . json_encode($_POST));

        $isIncome = $_POST[IS_INCOME_KEY_NAME];
        $amount = $_POST[AMOUNT_KEY_NAME];
        $comment = $_POST[COMMENT_KEY_NAME];

        switch (true) {
            case strlen($comment) > 60:
                throw new UnexpectedValueException('Comment is more than 60 symbols');
            case strlen($comment) === 0:
                throw new UnexpectedValueException('Comment is empty');
            case $amount = (float)$amount:
                throw new UnexpectedValueException('Amount should be a number');
            case $amount <= 0:
                throw new UnexpectedValueException('Amount should be a positive number');
            case !is_bool($isIncome):
                throw new UnexpectedValueException(IS_INCOME_KEY_NAME . ' parameter should be true or false');
        }

        Log::debug("PostResource content: [$isIncome, $amount, $comment]");

        return new self($isIncome, $amount, $comment);
    }
}