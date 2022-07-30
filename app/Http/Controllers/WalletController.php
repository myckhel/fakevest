<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Myckhel\Paystack\Support\Recipient;
use Myckhel\Paystack\Support\Transfer;

class WalletController extends Controller
{
  function viewNaira(Request $request)
  {
    $request->validate([]);

    $user = $request->user();

    return $user->wallets()->firstOrCreate(['name' => 'naira'], ['name' => 'naira']);
  }

  function viewDollar(Request $request)
  {
    $request->validate([]);

    $user = $request->user();

    return $user->wallets()->whereName('dollar')->firstOrCreate(['name' => 'dollar']);
  }

  public function withdraw(Request $request)
  {
    $request->validate([
      'from_wallet_id'  => 'required|int',
      'to_user_account' => 'required|int',
      'amount'          => 'required|numeric',
    ]);

    $user = $request->user();
    $from_wallet_id   = $request->from_wallet_id;
    $to_user_account  = $request->to_user_account;
    $amount           = $request->amount;

    $wallet           = Wallet::whereId($from_wallet_id)
      ->belongsToUser($user)
      ->firstOrFail();

    $bankAccount  = $user->bankAccounts()->findOrFail($to_user_account);

    $recipient    = (object) Recipient::fetch($bankAccount->recipient_id);

    if ($wallet->holder::class == Saving::class) {
      $plan = $wallet->holder->plan;

      if (!$plan->breakable) {
        return response()->json([
          'message' => 'This plan is not breakable'
        ], 403);
      }
    }

    $wallet->withdraw($amount);

    $wallet->balance;

    try {
      $transfer = Transfer::initiate([
        'recipient' => $recipient->data['recipient_code'],
        'source'    => 'balance',
        'amount'    => $amount * 100,
        'reason'    => "Withdrawal from $wallet->name wallet",
      ]);
    } catch (\Throwable $th) {
      $wallet->deposit($amount);
      throw $th;
    }

    return [
      'status'    => true,
      'message'   => 'Withdrawal successful',
      'transfer'  => $transfer,
      'wallet'    => $wallet
    ];
  }

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

    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;
    $user     = $request->user();

    return $user->wallets()
      ->withBalanceDiff()
      ->orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->paginate($pageSize);
  }

  function totalSavings(Request $request)
  {
    $request->validate([]);

    $user     = $request->user();

    $balance = Wallet::belongsToUser($user, true)
      ->sum('balance');

    $collect = Wallet::belongsToUser($user, true)
      ->whereHas('trans', fn ($q) => $q->whereWithinDay('transactions'))
      ->withSum(['trans as balance_change' => fn ($q) => $q->whereWithinDay('transactions')], 'amount')
      ->withSum(['trans as balance_change_percentage' => fn ($q) => $q->whereWithinDay('transactions')], DB::raw(Wallet::$changePercentageSyntax))
      ->get();

    $balance_change = $collect->sum('balance_change');
    $balance_change_percentage = $collect->sum('balance_change_percentage');

    return [
      'balance' => (float) $balance,
      'balance_change' => $balance_change,
      'balance_change_percentage' => $balance_change_percentage
    ];
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
    $user     = $request->user();

    return Wallet::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Wallet  $wallet
   * @return \Illuminate\Http\Response
   */
  public function show(Wallet $wallet)
  {
    $this->authorize('view', $wallet);
    return $wallet;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Wallet  $wallet
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Wallet $wallet)
  {
    $this->authorize('update', $wallet);
    $request->validate([]);
    $user     = $request->user();

    $wallet->update(array_filter($request->only($wallet->getFillable())));

    return $wallet;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Wallet  $wallet
   * @return \Illuminate\Http\Response
   */
  public function destroy(Wallet $wallet)
  {
    $this->authorize('delete', $wallet);

    $wallet->delete();

    return ['status' => true];
  }
}
