<?php

namespace App\Models;

use Bavix\Wallet\Models\Transaction as ModelsTransaction;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends ModelsTransaction
{
  use HasFactory;

  function scopeUser($q, User $user, array $queries = [])
  {
    @[
      'wallet_name'   => $wallet_name,
      'wallet_names'  => $wallet_names,
      'wallet_id'     => $wallet_id,
    ] = $queries;

    $q->when(
      $wallet_name || $wallet_names || $wallet_id,
      fn ($q) => $q->whereHas(
        'wallet',
        fn ($q) => $q
          ->belongsToUser($user)
          ->when(
            $wallet_name || $wallet_names,
            fn ($q) => $q->when($wallet_names, fn ($q) => $q->whereIn('name', $wallet_names), fn ($q) => $q->whereName($wallet_name)),
            fn ($q) => $q->whereId($wallet_id),
          )
      ),
      fn ($q) => $q->belongsToUser($user, $queries),
    );
  }

  function scopeBelongsToUser($q, User $user, array $queries = []): Builder
  {
    @[
      'saving_id'     => $saving_id,
    ] = $queries;

    return $q->whereHas(
      'payable',
      fn ($q) => $q->wherePayableType(Saving::class)
        ->when($saving_id, fn ($q) => $q->wherePayableId($saving_id))
        ->where(
          'payable_id',
          fn ($q) => $q
            ->select('id')
            ->from('savings')
            ->whereUserId($user->id)
            ->whereColumn('transactions.payable_id', 'savings.id')
        )
    )->when(!$saving_id, fn ($q) => $q->orWhere(
      fn ($q) => $q->wherePayableType(User::class)->wherePayableId($user->id)
    ));
  }

  function scopeWhereWithinDay($q, $column = false)
  {
    $column = $column ? "$column." : "";
    $q->where($column . "created_at", ">", Carbon::now()->subDay())->where($column . "created_at", "<", Carbon::now());
  }

  /**
   * @var array
   */
  protected $casts = [
    'wallet_id' => 'int',
    'confirmed' => 'bool',
    'meta'      => 'json',
    'amount'    => 'int',
  ];
}
