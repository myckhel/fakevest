<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
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

    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;
    $user     = $request->user();

    return $user->wallet()
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
