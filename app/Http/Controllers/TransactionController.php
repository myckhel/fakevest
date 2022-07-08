<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
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
      'saving_id'   => 'int',
    ]);

    $user       = $request->user();
    $pageSize   = $request->pageSize;
    $order      = $request->order;
    $orderBy    = $request->orderBy;
    $saving_id  = $request->saving_id;

    return Transaction::when(
      $saving_id,
      fn ($q) => $q->wherePayableType(Saving::class)
        ->wherePayableId($saving_id),
      fn ($q) => $q->wherePayableType(User::class)
        ->wherePayableId($user->id)
    )
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
    $user     = $request->user();

    return Transaction::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return \Illuminate\Http\Response
   */
  public function show(Transaction $transaction)
  {
    $this->authorize('view', $transaction);
    return $transaction;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Transaction  $transaction
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Transaction $transaction)
  {
    $this->authorize('update', $transaction);
    $request->validate([]);
    $user     = $request->user();

    $transaction->update(array_filter($request->only($transaction->getFillable())));

    return $transaction;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return \Illuminate\Http\Response
   */
  public function destroy(Transaction $transaction)
  {
    $this->authorize('delete', $transaction);

    $transaction->delete();

    return ['status' => true];
  }
}
