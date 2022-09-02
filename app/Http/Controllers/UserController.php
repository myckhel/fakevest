<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
  /**
   * Get portfolio of the auth user.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  function portfolio(Request $request)
  {
    $request->validate([]);

    $user = $request->user();

    $transactionQuery = Transaction::belongsToUser($user);

    $lifetime = $transactionQuery->whereType('deposit')->sum('amount');

    $chart = $transactionQuery->latest()->limit(10)->get('amount')->pluck('amount');

    $collect = Wallet::belongsToUser($user)
      ->whereHas('trans', fn ($q) => $q->whereWithinDay('transactions'))
      ->withSum(['trans as balance_change' => fn ($q) => $q->whereWithinDay('transactions')], 'amount')
      ->withSum(
        ['trans as balance_change_percentage' => fn ($q) => $q->whereWithinDay('transactions')],
        DB::raw(Wallet::$changePercentageSyntax)
      )->get();

    $balance_change = $collect->sum('balance_change');
    $balance_change_percentage = $collect->sum('balance_change_percentage');

    $thisYear = $transactionQuery
      ->whereYear('created_at', Carbon::now()->year)
      ->sum('amount');

    $thisMonth = $transactionQuery
      ->whereMonth('created_at', Carbon::now()->month)
      ->whereYear('created_at', Carbon::now()->year)
      ->sum('amount');

    $thisWeek = $transactionQuery
      ->whereMonth('created_at', Carbon::now()->month)
      ->whereYear('created_at', Carbon::now()->year)
      ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
      ->sum('amount');

    $walletLifetime = Wallet::whereHolderId($user->id)->whereHolderType($user::class)
      ->whereType('deposit')
      ->leftJoin('transactions', 'transactions.wallet_id', 'wallets.id')
      ->sum('amount');

    $savingPer = $lifetime ? ($lifetime - $walletLifetime) / $lifetime * 100 : 0;

    return [
      'lifetime'  => (float) $lifetime,
      'balance_change' => $balance_change,
      'balance_change_percentage' => $balance_change_percentage,
      'thisMonth' => (float) $thisMonth,
      'thisYear'  => (float) $thisYear,
      'thisWeek'  => (float) $thisWeek,
      'net'       => [
        'savings' => (float) $savingPer,
        'wallet'  => 100 - $savingPer,
      ],
      'chart'     => $chart,
    ];
  }
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function random(Request $request)
  {
    $request->validate([
      'orderBy'     => '',
      'order'       => 'in:asc,desc',
      'pageSize'    => 'int',
    ]);

    $pageSize = $request->pageSize;

    $users = User
      ::with('wallets')
      ->inRandomOrder()
      ->withUrls(['avatar'])
      ->paginate($pageSize);

    $users->each(fn ($user) => $user->withUrls(['avatar']));

    return $users;
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

    $users = User
      ::orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->withUrls(['avatar'])
      ->paginate($pageSize);

    $users->each(fn ($user) => $user->withUrls(['avatar']));

    return $users;
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

    return User::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function show($userIdOrName)
  {
    $user = User::when(
      (int) $userIdOrName,
      fn ($q) => $q->whereId($userIdOrName),
      fn ($q) => $q->whereUsername($userIdOrName)
    )->firstOrFail();

    $this->authorize('view', $user);

    return $user->withUrls(['avatar']);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, User $user)
  {
    $this->authorize('update', $user);
    $request->validate([
      'fullname'    => '',
      'dob'         => 'date',
      'gender'      => 'in:male,female',
      'next_of_kin' => '',
      'address'     => '',
    ]);

    $user     = $request->user();

    $user->update(array_filter($request->only($user->getFillable())));

    return $user;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function updateAvatar(Request $request, User $user)
  {
    $this->authorize('updateAvatar', $user);

    $request->validate([
      'avatar'              => 'image',
    ]);
    $avatar = $request->avatar;

    $user->saveImage($avatar, 'avatar');

    return $user;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function destroy(User $user)
  {
    $this->authorize('delete', $user);

    $user->delete();

    return ['status' => true];
  }
}
