<?php

namespace App\Models;

use App\Casts\FloatCast;
use App\Casts\Jsonable;
use App\Notifications\Challenge\Won;
use Bavix\Wallet\Interfaces\Wallet;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Traits\HasWallets;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserChallenge extends Model implements Wallet
{
  use HasFactory, HasWallet, HasWallets, HasSavingWallet;

  function processChallengeWon()
  {
    $this->stopPlanSubscription();

    $this->transferBalance();
  }

  function transferBalance()
  {
    $wallet = $this->wallet;
    // deposit balance to user wallet
    if ($wallet->balance > 0) {
      $saving = $this->savings;
      $owner = $saving->user;

      $owner->id != $this->user->id && $owner->notify(new Won($saving, $this->user));

      return $this->transfer($this->user, $wallet->balance, ['desc' => "Challenge Won wallet tranfser (`$saving->desc`)"]);
    }
  }

  protected $fillable = ['saving_id', 'user_id', 'metas'];

  /**
   * Get the user that owns the UserChallenge
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the saving that owns the UserChallenge
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function savings(): BelongsTo
  {
    return $this->belongsTo(Saving::class, 'saving_id');
  }

  protected $casts = [
    'target_percentage' => FloatCast::class,
    'metas' => Jsonable::class
  ];
}
