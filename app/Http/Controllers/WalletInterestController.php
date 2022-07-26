<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\WalletInterest;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Http\Request;

class WalletInterestController extends Controller
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
    ]);

    $user     = $request->user();
    $order    = $request->order;
    $orderBy  = $request->orderBy;

    $dueQuery = WalletInterest::userInterests($user)
      ->whereDate(
        'last_earned',
        '<=',
        now()->subDays(1)->toDateTimeString()
      );


    $isEarningDue = $dueQuery->first('wallet_interests.id');

    $interests = WalletInterest
      ::select('wallet_interests.*')->userInterests($user)
      ->with([
        'wallet:id,holder_type,holder_id,balance,uuid',
        'wallet.holder' => fn (MorphTo $m) => $m
          ->constrain([Saving::class => fn ($q) => $q->select(['id', 'plan_id', 'user_id', 'desc'])])
      ])
      ->orderBy($orderBy ?? 'wallet_interests.id', $order ?? 'desc')
      ->get();

    if ($isEarningDue) {
      $interests->each(fn ($d) => $d->calculate($d->wallet->holder->plan));
    }

    return $interests;
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

    return WalletInterest::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\WalletInterest  $walletInterest
   * @return \Illuminate\Http\Response
   */
  public function show(WalletInterest $walletInterest)
  {
    $this->authorize('view', $walletInterest);
    return $walletInterest;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\WalletInterest  $walletInterest
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, WalletInterest $walletInterest)
  {
    $this->authorize('update', $walletInterest);
    $request->validate([]);
    $user     = $request->user();

    $walletInterest->update(array_filter($request->only($walletInterest->getFillable())));

    return $walletInterest;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\WalletInterest  $walletInterest
   * @return \Illuminate\Http\Response
   */
  public function destroy(WalletInterest $walletInterest)
  {
    $this->authorize('delete', $walletInterest);

    $walletInterest->delete();

    return ['status' => true];
  }
}
