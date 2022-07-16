<?php

namespace App\Models;

use App\Casts\FloatCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Bavix\Wallet\Models\Wallet as BaseWallet;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class Wallet extends BaseWallet
{
  use HasFactory;



  function scopeBelongsToUser($q, User $user): Builder
  {
    return $q->whereHas(
      'holder',
      fn ($q) => $q
        ->where(fn ($q) => $q->whereHolderType(User::class)
          ->whereHolderId($user->id))
        ->orWhere(
          fn ($q) => $q->whereHolderType(Saving::class)
            ->where(
              'holder_id',
              fn ($q) => $q
                ->select('id')
                ->from('savings')
                ->whereUserId($user->id)
                ->whereColumn('wallets.holder_id', 'savings.id')
            )
        )
    );
  }

  function scopeWhereWithinDay($q)
  {
    $q->where("created_at", ">", Carbon::now()->subDay())->where("created_at", "<", Carbon::now());
  }

  function scopeWithBalanceDiff($q)
  {
    $q->withSum([
      'trans as balance_change' => fn ($q) => $q->whereWithinDay(),
    ], 'amount')
      ->withSum([
        'trans as balance_change_percentage' => fn ($q) => $q->whereWithinDay(),
      ], DB::raw('wallets.balance - amount / amount * 100'));
  }

  function trans()
  {
    return $this->hasMany(Transaction::class);
  }

  protected $casts = [
    'balance' => 'float', 'decimal_places' => 'int',
    'meta'    => 'json', 'balance_change' => FloatCast::class,
    'balance_change_percentage' => FloatCast::class,
  ];

  static function fromKobo(int $figure)
  {
    return $figure / 100;
  }
}
