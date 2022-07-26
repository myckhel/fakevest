<?php

namespace App\Models;

use App\Casts\FloatCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Bavix\Wallet\Models\Wallet as BaseWallet;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Wallet extends BaseWallet
{
  use HasFactory;

  static $changePercentageSyntax = "CASE WHEN wallets.balance - transactions.amount = 0 THEN transactions.amount
    ELSE (wallets.balance - (wallets.balance - transactions.amount)) / (wallets.balance - transactions.amount) * 100 END";

  function scopePureUser($q, User $user)
  {
    $q->leftJoin(
      'savings',
      fn ($j) => $j->on('savings.id', 'wallets.holder_id')
        ->where('wallets.holder_type', Saving::class)
    )
      ->leftJoin(
        'user_challenges',
        fn ($j) => $j->on('user_challenges.id', 'wallets.holder_id')
          ->where('wallets.holder_type', UserChallenge::class)
      )
      ->leftJoin(
        'users',
        fn ($j) => $j->on('savings.user_id', 'users.id')
          ->orOn('user_challenges.user_id', 'users.id')
          ->orOn('wallets.holder_id', 'users.id')
      )
      ->leftJoin('transactions', 'transactions.wallet_id', 'wallets.id')
      ->where(
        fn ($q) => $q
          ->where(
            fn ($q) => $q
              ->where('wallets.holder_type', Saving::class)
              ->where('users.id', $user->id)
          )->orWhere(fn ($q) => $q->where(
            fn ($q) => $q
              ->whereHolderId($user->id)
              ->whereHolderType(User::class)
          ))->orWhere(
            fn ($q) => $q->where('wallets.holder_type', UserChallenge::class)
              ->where('user_challenges.user_id', $user->id)
          )
      );
  }

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

  function scopeWhereWithinDay($q, $column = false)
  {
    $column = $column ? "$column." : "";
    $q->where($column . "created_at", ">", Carbon::now()->subDay())->where($column . "created_at", "<", Carbon::now());
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

  /**
   * Get the interest associated with the Wallet
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasOne
   */
  public function interest(): HasOne
  {
    return $this->hasOne(WalletInterest::class);
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
