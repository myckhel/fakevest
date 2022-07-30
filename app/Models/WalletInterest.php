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

  function resetEarning()
  {
    return $this->update([
      'last_payout' => Carbon::now(),
      'amount' => 0
    ]);
  }

  function earnInterest()
  {
    $this->wallet->loadMorph('holder', [Saving::class => ['user', 'plan']]);

    $this->calculate($this->wallet->holder->plan);

    $user = $this->wallet->holder->user;
    $saving = $this->wallet->holder;

    $user->deposit("$this->amount", [
      'desc' => "Interest on ($saving->desc)", 'interest_id' => $this->id
    ]);

    $this->resetEarning();
  }

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

      $earned = ($amount - $wallet->balance) + $this->amount;

      $this->update([
        'last_earned' => $now,
        'amount' => $earned,
      ]);

      return $earned;
    }
    return 0;
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
