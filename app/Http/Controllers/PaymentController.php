<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Saving;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Myckhel\Paystack\Events\Hook;
use Myckhel\Paystack\Support\Transaction;

class PaymentController extends Controller
{
  function hooks(Request $request)
  {
    event(new Hook($request->all()));

    return ['status' => true];
  }

  public function verify(Request $request)
  {
    $request->validate(['reference' => 'required']);

    $paymentDetails   = (object) Transaction::verify($request->reference)['data'];

    return Payment::process($paymentDetails);
  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $request->validate([
      'orderBy'     => ['regex:(amount|message|reference|currency_code|status)', 'nullable'],
      'order'       => 'in:asc,desc',
      'pageSize'    => 'int',
    ]);

    $user     = $request->user();
    $search   = $request->search;
    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;

    $payments = $user->payments()
      ->when($search, fn ($q) => $q->where('status', 'LIKE', "%$search%")
        ->orWhere('amount', 'LIKE', "%$search%")->orWhere('reference', 'LIKE', "%$search%")
        ->orWhere('message', 'LIKE', "%$search%")->orWhere('currency_code', 'LIKE', "%$search%"))
      ->with(['wallet'])
      ->orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->paginate($pageSize);

    return $payments;
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $request->validate([
      'amount'        => 'required|numeric',
      'wallet_name'   => 'string',
      'wallet_id'     => 'int',
    ]);

    $user             = $request->user();
    $wallet_name      = $request->wallet_name;
    $wallet_id        = $request->wallet_id;
    $reference        = $request->reference;
    $wallet           = null;

    if ($wallet_name || $wallet_id) {
      Wallet::where(
        fn ($q) => $q
          ->where(
            fn ($q) => $q
              ->where('wallets.holder_type', Saving::class)
              ->where('users.id', $user->id)
          )->orWhere(fn ($q) => $q->where(
            fn ($q) => $q->whereHolderId($user->id)
              ->whereHolderType(User::class)
          ))
      )
        ->join('savings', 'savings.id', 'wallets.holder_id')
        ->join('users', 'savings.user_id', 'users.id')
        ->when(
          $wallet_id,
          fn ($q) => $q->where('wallets.id', $wallet_id),
          fn ($q) => $q->where('wallets.name', $wallet_name)
        )->firstOrFail();
    } else {
      $wallet = $user->wallet;
    }

    $amount           = $request->amount * 100;
    $data             = ["amount" => $amount, "email" => $user->email, 'reference' => $reference, 'callback_url' => config('app.url') . "/api/paystack/hooks"];
    $response         = Transaction::initialize($data);
    $responseData     = (object) $response['data'];

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
   * @param  \App\Models\Payment  $payment
   * @return \Illuminate\Http\Response
   */
  public function show(Payment $payment)
  {
    $this->authorize('view', $payment);
    return $payment;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Payment  $payment
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Payment $payment)
  {
    $this->authorize('update', $payment);
    $request->validate([]);
    $user     = $request->user();

    $payment->update(array_filter($request->only($payment->getFillable())));

    return $payment;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Payment  $payment
   * @return \Illuminate\Http\Response
   */
  public function destroy(Payment $payment)
  {
    $this->authorize('delete', $payment);

    $payment->delete();

    return ['status' => true];
  }
}
