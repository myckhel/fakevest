<?php

namespace App\Models;

use App\Casts\FloatCast;
use App\Models\Wallet as ModelsWallet;
use App\Notifications\Saving\Matured;
use App\Traits\HasImage;
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
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;
use Binkode\Paystack\Support\Charge;
use Binkode\Paystack\Support\Plan as PayPlan;
use Binkode\Paystack\Support\Subscription;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Saving extends Model implements Wallet, HasMedia
{
  use HasFactory, HasWhenSetWhere, HasWallet, HasWallets, InteractsWithMedia, HasImage, HasSavingWallet;

  static $syntaxTargetPercent = "NULLIF(wallets.balance, 0) / NULLIF(target, 0) * 100";

  static $syntaxBalancePercent = "CASE WHEN wallets.balance - amount = 0 THEN amount
    ELSE (wallets.balance - (wallets.balance - amount)) / (wallets.balance - amount) * 100 END";

  function processMatured()
  {
    // disable saving subscriptions
    $this->stopPlanSubscription();

    $transfer = $this->transferBalance();

    $this->earnInterest($this->wallet);

    $transfer && $this->sendMaturedNotification($this->wallet->holder);

    $this->update(['active' => false]);
  }

  function transferBalance()
  {
    $wallet = $this->wallet;
    // deposit balance to user wallet
    if ($wallet->balance > 0) {
      $saving = $wallet->holder;

      return $saving?->transfer($saving?->user, $wallet->balance, ['desc' => "Saving matured wallet tranfser (`$saving->desc`)"]);
    }
  }

  function sendMaturedNotification(Saving $saving)
  {
    $saving?->user?->notify(new Matured($saving));
  }

  function earnInterest(Wallet $wallet)
  {
    $interest = $wallet->interest;
    if ($interest) {
      $interest->earnInterest($wallet, false, true);
    }
  }

  function processCreated($userChallenge = null)
  {
    $email    = $this->user->email;
    $customer_code    = $this->user->metas['customer_code'] ?? null;
    $isChallenge = $this->plan->name == 'Challenge';
    $wallet_id = $this->metas['wallet_id'] ?? null;

    if ($wallet_id) {
      $wallet = $this->wallet;

      $fromWallet = $this->user->wallets()->whereName('naira')->findOrFail($wallet_id);

      try {
        $fromWallet->transfer($wallet, $this->amount, ['desc' => "Transfer between wallets"]);
      } catch (\Throwable $e) {
        if (get_class($e) == BalanceIsEmpty::class) {
          abort(400, $e->getMessage());
        } else {
          throw $e;
        }
      }
    } else {
      $payment_option_id = $this->metas['payment_option_id'] ?? null;
      if ($payment_option_id) {
        $option = PaymentOption::find($payment_option_id);
      } else {
        $option = PaymentOption::first();
      }

      $option && Charge::create([
        'authorization_code'  => $option->authorization_code,
        'amount'              => $this->amount * 100,
        'email'               => $this->user->email,
        'metadata'            => $isChallenge
          ? ['user_challenge_id' => $userChallenge->id]
          : ['saving_id' => $this->id]
      ]);
    }

    if ($this->interval) {
      $plan = (object) PayPlan::create([
        'name'        => $this->desc,
        'description' => $this->desc,
        'amount'      => $this->amount * 100,
        'interval'    => $this->interval,
      ])['data'];

      Subscription::create([
        'plan'        => $plan->plan_code,
        'customer'    => $customer_code ?? $email,
        'start_date'  => Carbon::now()->addSeconds(60 * 2)->toIso8601String(),
      ]);

      $isChallenge
        ? $userChallenge?->update(['payment_plan_id' => $plan->id])
        : $this->update(['payment_plan_id' => $plan->id]);
    }
  }

  function scopeWhereIsChallenge($q): Builder
  {
    return $q->whereHas('plan', fn($q) => $q->whereName('Challenge'));
  }

  function scopeWhereActive($q): Builder
  {
    return $q->where('until', '>=', Carbon::now());
  }

  function scopeActive($q): Builder
  {
    return $q->where('active', 1);
  }

  function scopeWithBalanceChangePercentage($q): Builder
  {
    return $q
      ->withSum([
        'trans as balance_change_percentage' => fn($q) => $q
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

  function scopeWithChallengeCompletion($q, User $user): Builder
  {
    return $q->withSum(
      ['participantWallet as challenge_target_percentage' => fn($q) => $q->where('user_challenges.user_id', $user->id)],
      DB::raw(self::$syntaxTargetPercent)
    );
  }

  function loadBalanceChangePercentage(): self
  {
    return $this->loadSum([
      'trans as balance_change_percentage' => fn($q) => $q
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

  function participantsWallet()
  {
    return $this->hasManyThrough(ModelsWallet::class, UserChallenge::class, 'saving_id', 'holder_id')->whereHolderType(UserChallenge::class);
  }

  function participantWallet()
  {
    return $this->hasOneThrough(ModelsWallet::class, UserChallenge::class, 'saving_id', 'holder_id')->whereHolderType(UserChallenge::class);
  }

  function participants(): HasMany
  {
    return $this->hasMany(UserChallenge::class);
  }

  function participant(): HasOne
  {
    return $this->hasOne(UserChallenge::class);
  }

  function trans(): MorphMany
  {
    return $this->morphMany(Transaction::class, 'payable');
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
    'title',
    'active'
  ];

  protected $casts = [
    'plan_id' => 'int',
    'times'   => 'int',
    'amount'  => 'float',
    'target'  => 'float',
    'metas'   => 'array',
    'target_percentage' => FloatCast::class,
    'balance_change_percentage' => FloatCast::class,
    'challenge_target_percentage' => FloatCast::class,
    'active'    => 'boolean',
    'public'    => 'boolean',
    'is_joined' => 'boolean',
  ];

  protected $hidden = ['media'];

  function registerMediaCollections(): void
  {
    $mimes = ['image/jpeg', 'image/png', 'image/gif'];
    $this->addMediaCollection('avatar')
      ->acceptsMimeTypes($mimes)
      ->singleFile()->useDisk('saving_avatars')
      ->registerMediaConversions($this->convertionCallback(false, false));
  }
}

trait HasSavingWallet
{
  function stopPlanSubscription()
  {
    if ($this->payment_plan_id) {
      $plan = (object) PayPlan::fetch($this->payment_plan_id)['data'];
      try {
        collect($plan?->subscriptions)->map(
          fn($sub) => Subscription::disable([
            'code' => $sub['subscription_code'],
            'token' => $sub['email_token']
          ])
        );
      } catch (\Throwable $th) {
      }
    }
  }
}
