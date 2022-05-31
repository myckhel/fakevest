<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
  use HasFactory;

  static function process(object $paymentDetails)
  {
    $payment          = static::where('reference', $paymentDetails->reference)->first();

    if ($payment && $payment->status == 'pending') {
      $user           = $payment->user;
      if ($paymentDetails->status != 'success') {
        $payment->update([
          'status' => $paymentDetails->status,
        ]);
      }

      if ($paymentDetails->status == 'success') {
        $payment->update([
          'status'              => $paymentDetails->status,
          'message'             => $paymentDetails->message,
          'reference'           => $paymentDetails->reference,
          'authorization_code'  => $paymentDetails->authorization['authorization_code'],
          'currency_code'       => $paymentDetails->currency,
          'paid_at'            => now(), //$paymentDetails['data']['paidAt'],
        ]);

        $user             = $payment->user;

        if ($paymentDetails->plan) {
          $saving = Saving::wherePaymentPlanId($paymentDetails->plan['id'])->first();
          $wallet = $saving->wallet;
          if ($wallet) {
            $wallet->deposit($wallet::fromKobo($paymentDetails->amount));
          } else {
            $user->deposit(Wallet::fromKobo($paymentDetails->amount));
          }
        } else {
          $wallet = $payment->wallet;

          if ($wallet) {
            $wallet->deposit($wallet::fromKobo($paymentDetails->amount));
          } else {
            $user->deposit(Wallet::fromKobo($paymentDetails->amount));
          }
        }

        if ($paymentDetails->status = "success" && $paymentDetails->authorization['reusable']) {
          $user->payment_options()->firstOrCreate(
            ['signature' => $paymentDetails->authorization['signature']],
            $paymentDetails->authorization
          );
        }
      }

      return ['status' => true, 'payment' => $payment];
    }
    return ['status' => false, 'payment' => $payment];
  }

  /**
   * Get the wallet that owns the Payment
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function wallet(): BelongsTo
  {
    return $this->belongsTo(Wallet::class);
  }

  /**
   * Get the user that owns the Payment
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  protected $fillable = [
    'user_id',
    'access_code',
    'reference',
    'amount',
    'status',
    'message',
    'authorization_code',
    'currency_code',
    'paid_at',
    'wallet_id'
  ];

  protected $casts = ['user_id' => 'int', 'amount' => 'float', 'wallet_id' => 'int'];
}
