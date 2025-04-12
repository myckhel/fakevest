<?php

namespace App\Service;

use App\Models\User;
use Binkode\Paystack\Support\Transaction;

class PaymentOptionService
{
  /**
   * Create a new class instance.
   */
  public function __construct()
  {
    //
  }

  public function addCard(User $user)
  {
    $amount     = 100 * 100;

    $response   = Transaction::initialize([
      'email'   => $user->email,
      'amount'  => $amount,
      // 'callback_url'  => config('app.url') . "/api/v1/paystack/hooks",
    ]);

    $responseData     = (object) $response['data'];

    $wallet = $user->wallet;

    $payment = $user->payments()->create([
      'amount'        => $amount,
      'access_code'   => $responseData->access_code,
      'reference'     => $responseData->reference,
      'wallet_id'     => $wallet?->id,
    ]);

    $payment->authorization_url = $responseData->authorization_url;

    return $payment;
  }
}
