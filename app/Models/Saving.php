<?php

namespace App\Models;

use App\Casts\FloatCast;
use App\Traits\HasWhenSetWhere;
use Bavix\Wallet\Interfaces\Wallet;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Traits\HasWallets;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Saving extends Model implements Wallet
{
  use HasFactory, HasWhenSetWhere, HasWallet, HasWallets;

  static $syntaxTargetPercent = "NULLIF(wallets.balance, 0) / target * 100";

  function scopeWhereActive($q): Builder
  {
    return $q->where('until', '>=', Carbon::now());
  }

  function scopeWithTargetPercentage($q): Builder
  {
    return $q
      ->withSum([
        'plan as target_percentage' => fn ($q) => $q
          ->where('target', '!=', NULL)
          ->join('wallets', fn ($j) => $j->on('wallets.holder_id', 'savings.id')->whereHolderType(self::class)),
      ], DB::raw(self::$syntaxTargetPercent));
  }

  function scopeWithBalanceChangePercentage($q): Builder
  {
    return $q
      ->withSum([
        'trans as balance_change_percentage' => fn ($q) => $q
          ->whereWithinDay('transactions')->join('wallets', 'transactions.wallet_id', 'wallets.id')
      ], DB::raw('amount / wallets.balance * 100'));
  }

  function loadBalanceChangePercentage(): self
  {
    return $this->loadSum([
      'trans as balance_change_percentage' => fn ($q) => $q
        ->whereWithinDay('transactions')->join('wallets', 'transactions.wallet_id', 'wallets.id'),
    ], DB::raw('amount / wallets.balance * 100'));
  }

  function loadTargetPercentage(): self
  {
    return $this->loadSum([
      'plan as target_percentage' => fn ($q) => $q
        ->where('target', '!=', NULL)
        ->join('wallets', fn ($j) => $j->on('wallets.holder_id', 'savings.id')->whereHolderType(self::class)),
    ], DB::raw(self::$syntaxTargetPercent));
  }

  function trans(): HasMany
  {
    return $this->hasMany(Transaction::class, 'payable_id')->wherePayableType(self::class);
  }

  /**
   * Get the user that owns the Saving
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the plan that owns the Saving
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function plan(): BelongsTo
  {
    return $this->belongsTo(Plan::class);
  }

  protected $fillable = [
    'plan_id',
    'desc',
    'until',
    'times',
    'interval',
    'amount',
    'target',
    'active',
    'payment_plan_id',
    'metas',
  ];

  protected $casts = [
    'plan_id' => 'int',
    'times'   => 'int',
    'active'  => 'boolean',
    'amount'  => 'float',
    'target'  => 'float',
    'metas'   => 'array',
    'target_percentage' => FloatCast::class,
    'balance_change_percentage' => FloatCast::class,
  ];
}
