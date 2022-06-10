<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use Illuminate\Http\Request;
use Myckhel\Paystack\Support\Recipient;
use Myckhel\Paystack\Support\Verification;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class UserAccountController extends Controller
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

    return $user->bankAccounts()
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
    $request->validate([
      'type'            => 'in:nuban,basa',
      'account_number'  => 'required|digits:10',
      'bank_code'       => 'required',
      'description'     => '',
      'currency'        => 'in:NGN,USD',
    ]);

    $user     = $request->user();
    $account_number     = $request->account_number;
    $bank_code          = $request->bank_code;
    $type               = $request->type || 'nuban';

    $verification = (object) Verification::resolve([
      'account_number'  => $account_number,
      'bank_code'       => $bank_code
    ]);

    if (!$verification->status) {
      return new BadRequestException('Invalid Bank Account');
    }

    $recipient = (object) Recipient::create([
      'type'            => $type,
      'name'            => $user->fullname,
      'account_number'  => $account_number,
      'bank_code'       => $bank_code
    ])['data'];

    $account = $user->bankAccounts()->firstOrCreate([
      'account_number'  => $account_number,
      'bank_code'       => $bank_code
    ], $request->only([
      'type', 'account_number', 'bank_code', 'description', 'currency'
    ]) + ['recipient_id' => $recipient->id]);

    return $account;
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\UserAccount  $userAccount
   * @return \Illuminate\Http\Response
   */
  public function show(UserAccount $userAccount)
  {
    $this->authorize('view', $userAccount);
    return $userAccount->load(['user']);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\UserAccount  $userAccount
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, UserAccount $userAccount)
  {
    $this->authorize('update', $userAccount);
    $request->validate([]);
    $user     = $request->user();

    $userAccount->update(array_filter($request->only($userAccount->getFillable())));

    return $userAccount;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\UserAccount  $userAccount
   * @return \Illuminate\Http\Response
   */
  public function destroy(UserAccount $userAccount)
  {
    $this->authorize('delete', $userAccount);

    Recipient::remove($userAccount->recipient_id);

    $userAccount->delete();

    return ['status' => true];
  }
}
