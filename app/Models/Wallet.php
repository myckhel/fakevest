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

  static $changePercentageSyntax = "CASE WHEN wallets.balance - amount = 0 THEN amount
    ELSE (wallets.balance - (wallets.balance - amount)) / (wallets.balance - amount) * 100 END";

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
        ->orWhere(
          fn ($q) => $q->whereHolderType(UserChallenge::class)
            ->where(
              'holder_id',
              fn ($q) => $q
                ->select('id')
                ->from('user_challenges')
                ->whereUserId($user->id)
                ->whereColumn('wallets.holder_id', 'user_challenges.id')
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
      ], DB::raw(self::$changePercentageSyntax));
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
