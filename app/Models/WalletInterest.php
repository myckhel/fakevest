<?php

namespace App\Models;

use App\Casts\FloatCast;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletInterest extends Model
{
  use HasFactory;

  const nTime = 365;

  function scopeUserInterests($q, User $user)
  {
    return $q
      ->join('wallets', 'wallets.id', 'wallet_interests.wallet_id')
      ->join(
        'savings',
        fn ($q) => $q->on('wallets.holder_id', 'savings.id')
          ->whereHolderType(Saving::class)
      )
      ->join('users', 'savings.user_id', 'users.id')
      ->where('users.id', $user->id);
  }

  function calculate(Plan $plan)
  {
    $wallet = $this->wallet;

    if ((int) $wallet->balance > 0) {
      // A = P(1+r/n)**nt
      $now = Carbon::now();
      $elapsedMs = $now->getTimestampMs() - Carbon::parse($this->last_earned)->getTimestampMs();
      $elapsedDays = $elapsedMs / (1000 * 3600 * 24);
      $amount = $wallet->balance * pow(1 + ($plan->interest / 100) / self::nTime, $elapsedDays);

      $this->update([
        'last_earned' => $now,
        'amount' => ($amount - $wallet->balance) + $this->amount,
      ]);
    }
  }

  function getIsPayoutDueAttribute()
  {
    $last_payout = Carbon::parse($this->last_payout);
    $now = Carbon::now();

    return $now->greaterThan($last_payout) && !$now->isSameMonth($last_payout);
  }

  /**
   * Get the wallet that owns the WalletInterest
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function wallet(): BelongsTo
  {
    return $this->belongsTo(Wallet::class);
  }

  protected $appends = ['isPayoutDue'];
  protected $casts = ['amount' => FloatCast::class];

  protected $fillable = ['wallet_id', 'amount', 'last_earned', 'last_payout'];
}
