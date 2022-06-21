<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Bavix\Wallet\Models\Wallet as BaseWallet;
use Illuminate\Support\Facades\DB;

class Wallet extends BaseWallet
{
  use HasFactory;

  function getBalanceChangeAttribute($value)
  {
    return (float) $value ?: 0;
  }

  function getBalanceChangePercentageAttribute($value)
  {
    return (float) $value ?: 0;
  }

  function scopeWithBalanceDiff($q)
  {
    $q->withSum([
      'trans as balance_change' => fn ($q) => $q->whereWithinDay(),
    ], 'amount')
      ->withSum([
        'trans as balance_change_percentage' => fn ($q) => $q->whereWithinDay(),
      ], DB::raw('amount / wallets.balance * 100'));
  }

  function trans()
  {
    return $this->hasMany(Transaction::class);
  }

  protected $casts = [
    'balance' => 'float', 'decimal_places' => 'int',
    'meta' => 'json',
  ];

  static function fromKobo(int $figure)
  {
    return $figure / 100;
  }
}
