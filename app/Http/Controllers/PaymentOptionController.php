<?php

namespace App\Http\Controllers;

use App\Models\PaymentOption;
use Illuminate\Http\Request;
use Myckhel\Paystack\Support\Transaction;

class PaymentOptionController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $request->validate([
      'orderBy'     => '',
      'order'       => 'in:asc,desc',
      'pageSize'    => 'int',
    ]);

    $user     = $request->user();
    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;

    return $user->paymentOptions()
      ->orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->paginate($pageSize);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $request->validate([]);
    $user       = $request->user();
    $amount     = 100 * 100;

    $response   = Transaction::initialize([
      'email'   => $user->email,
      'amount'  => $amount,
      'callback_url' => config('app.url') . "/api/paystack/hooks"
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

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\PaymentOption  $paymentOption
   * @return \Illuminate\Http\Response
   */
  public function show(PaymentOption $paymentOption)
  {
    $this->authorize('view', $paymentOption);
    return $paymentOption;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\PaymentOption  $paymentOption
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, PaymentOption $paymentOption)
  {
    $this->authorize('update', $paymentOption);
    $request->validate([]);
    $user     = $request->user();

    $paymentOption->update(array_filter($request->only($paymentOption->getFillable())));

    return $paymentOption;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\PaymentOption  $paymentOption
   * @return \Illuminate\Http\Response
   */
  public function destroy(PaymentOption $paymentOption)
  {
    $this->authorize('delete', $paymentOption);

    $paymentOption->delete();

    return ['status' => true];
  }
}
