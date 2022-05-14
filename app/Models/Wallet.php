<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Bavix\Wallet\Models\Wallet as BaseWallet;

class Wallet extends BaseWallet
{
  use HasFactory;

  protected $casts = [
    'balance' => 'float', 'decimal_places' => 'int',
    'meta' => 'json',
  ];

  static function fromKobo(int $figure)
  {
    return $figure / 100;
  }
}
