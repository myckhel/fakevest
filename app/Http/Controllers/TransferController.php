<?php

namespace App\Http\Controllers;

use App\Http\Middleware\PinRequired;
use App\Models\Transfer;
use App\Models\User;
use App\Models\Wallet;
use Bavix\Wallet\Exceptions\BalanceIsEmpty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransferController extends Controller
{
  function __construct()
  {
    $this->middleware([PinRequired::class], ['only' => 'store']);
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

    $user     = $request->user();
    $pageSize = $request->pageSize;
    $order    = $request->order;
    $orderBy  = $request->orderBy;

    return Transfer
      ::orderBy($orderBy ?? 'id', $order ?? 'desc')
      ->where(function ($query) use ($user) {
        $query->where('from_id', $user->id)
          ->orWhere('to_id', $user->id);
      })
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
      'username'      => Rule::requiredIf(!$request->to_wallet_id),
      'wallet_id'     => 'required|int',
      'amount'        => 'required|numeric',
      'to_wallet_id'  => 'int',
      'pin'           => 'required|digits_between:4,8',
    ]);
    $user     = $request->user();
    $to_wallet_id = $request->to_wallet_id;
    $wallet_id    = $request->wallet_id;
    $username     = $request->username;

    // The PIN validation is handled by PinRequired middleware
    // which will abort with a 403 if pin is incorrect

    $otherUser = ($to_wallet_id && !$username) ? null : User::whereUsername($username)->firstOrFail();
    $wallets = Wallet::belongsToUser($user)->whereIn('id', [$wallet_id, $to_wallet_id])->get();

    if ($to_wallet_id && count($wallets) < 2) {
      abort(404, "Wallet Not Found");
    }

    $fromWallet = $wallets->first(fn($w) => $w->id == $wallet_id);
    $toWallet   = $username ? null : $wallets->first(fn($w) => $w->id == $to_wallet_id);

    try {
      return $fromWallet->transfer($otherUser ?? $toWallet, $request->amount, ['desc' => $otherUser ? "Transfer from $user->username to $otherUser->username" : "Transfer between wallets"]);
    } catch (\Throwable $e) {
      if (get_class($e) == BalanceIsEmpty::class) {
        abort(400, $e->getMessage());
      } else {
        throw $e;
      }
    }
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Transfer  $transfer
   * @return \Illuminate\Http\Response
   */
  public function show(Transfer $transfer)
  {
    $this->authorize('view', $transfer);
    return $transfer;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Transfer  $transfer
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Transfer $transfer)
  {
    $this->authorize('update', $transfer);
    $request->validate([]);
    $user     = $request->user();

    $transfer->update(array_filter($request->only($transfer->getFillable())));

    return $transfer;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Transfer  $transfer
   * @return \Illuminate\Http\Response
   */
  public function destroy(Transfer $transfer)
  {
    $this->authorize('delete', $transfer);

    $transfer->delete();

    return ['status' => true];
  }
}
