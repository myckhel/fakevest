<?php

namespace App\Models;

use App\Casts\ActiveCast;
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

  static $syntaxBalancePercent = "amount / wallets.balance * 100";

  function scopeWhereIsChallenge($q): Builder
  {
    return $q->whereHas('plan', fn ($q) => $q->whereName('Challenge'));
  }

  function scopeWhereActive($q): Builder
  {
    return $q->where('until', '>=', Carbon::now());
  }

  function scopeWithBalanceChangePercentage($q): Builder
  {
    return $q
      ->withSum([
        'trans as balance_change_percentage' => fn ($q) => $q
          ->whereWithinDay('transactions')->join('wallets', 'transactions.wallet_id', 'wallets.id')
      ], DB::raw(self::$syntaxBalancePercent));
  }

  function scopeWithTargetPercentage($q): Builder
  {
    return $q->withSum(
      ['wallet as target_percentage'],
      DB::raw(self::$syntaxTargetPercent)
    );
  }

  function loadBalanceChangePercentage(): self
  {
    return $this->loadSum([
      'trans as balance_change_percentage' => fn ($q) => $q
        ->whereWithinDay('transactions')->join('wallets', 'transactions.wallet_id', 'wallets.id'),
    ], DB::raw(self::$syntaxBalancePercent));
  }

  function loadTargetPercentage(): self
  {
    return $this->loadSum(
      ['wallet as target_percentage'],
      DB::raw(self::$syntaxTargetPercent)
    );
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
    'payment_plan_id',
    'metas',
    'public',
  ];

  protected $casts = [
    'plan_id' => 'int',
    'times'   => 'int',
    'amount'  => 'float',
    'target'  => 'float',
    'metas'   => 'array',
    'target_percentage' => FloatCast::class,
    'balance_change_percentage' => FloatCast::class,
    'active' => ActiveCast::class,
    'public' => 'boolean',
  ];

  protected $appends = ['active'];
}
