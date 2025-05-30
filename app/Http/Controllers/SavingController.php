<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Saving;
use Illuminate\Http\Request;

class SavingController extends Controller
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
      'active'      => 'boolean',
    ]);

    $user     = $request->user();
    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;

    return $user->savings()
      ->with(['plan', 'wallet'])
      ->withTargetPercentage()
      ->withBalanceChangePercentage()
      ->whereActive()
      ->active()
      ->orderBy($orderBy ?? 'id', $order ?? 'desc')
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
    $request->validate([
      'plan_id'   => 'required|int',
      'until'     => 'date',
      'times'     => 'int',
      'interval'  => 'in:daily,weekly,monthly,biannually,annually||nullable',
      'amount'    => 'digits_between:3,15',
      'target'    => 'digits_between:3,15',
      'public'    => 'bool',
      'payment_option_id'    => 'int',
      'avatar'    => 'image',
      'title'     => 'string|nullable',
    ]);

    $user     = $request->user();

    $data     = $request->only([
      'plan_id',
      'desc',
      'until',
      'times',
      'amount',
      'target',
      'public',
      'title',
    ]);

    $payment_option_id = $request->payment_option_id;
    $wallet_id = $request->wallet_id;

    $plan = Plan::findOrFail($request->plan_id);

    if (!$plan->minDays) {
      $data['interval'] = $request->interval;
    }

    if ($payment_option_id) {
      $user->paymentOptions()->findOrFail($payment_option_id);
    } elseif ($wallet_id) {
      $user->wallets()->whereName('naira')->findOrfail($wallet_id);
    }

    $metas = ($payment_option_id
      ? ['metas' => ['payment_option_id' => (int) $payment_option_id]]
      : ($wallet_id ? ['metas' => ['wallet_id' => (int) $wallet_id]] : []
      )
    );

    $saving = $user->savings()->create($data + $metas);

    $saving->saveImage($request->avatar, 'avatar');

    return $saving;
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Http\Response
   */
  public function show(Saving $saving)
  {
    $this->authorize('view', $saving);
    return $saving->load(['plan', 'wallet'])
      ->loadBalanceChangePercentage()
      ->loadTargetPercentage();
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Saving $saving)
  {
    $this->authorize('update', $saving);
    $request->validate([
      'until'     => 'date',
      'times'     => 'int',
      'interval'  => 'in:daily,weekly,monthly,biannually,annually',
      'amount'    => 'digits_between:3,15',
      'target'    => 'digits_between:3,15',
      'public'    => 'bool',
      'title'     => 'string|nullable'
    ]);

    $saving->update(array_filter($request->only(
      ['desc', 'until', 'times', 'interval', 'amount', 'target', 'public']
    )));

    return $saving->load(['plan', 'wallet']);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Http\Response
   */
  public function destroy(Saving $saving)
  {
    $this->authorize('delete', $saving);

    $saving->delete();

    return ['status' => true];
  }
}
