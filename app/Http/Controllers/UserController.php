<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UserController extends Controller
{
  function changePassword(Request $request)
  {
    $request->validate([
      'password'     => 'required|min:6',
      'old_password' => 'required|min:6',
    ]);

    $user = $request->user();

    $password = $request->password;
    $old_password = $request->old_password;

    if (!Hash::check($old_password, $user->password)) {
      abort(403, "Old password incorrect");
    } elseif (Hash::check($password, $user->password)) {
      abort(403, "You cannot set old password");
    }

    $user->update([
      'password' => Hash::make($password)
    ]);

    return ['message' => 'Password Updated Successfully', 'status' => true];
  }

  function verifyPin(Request $request)
  {
    $user = $request->user();

    $request->validate([
      'pin' => 'required|digits_between:4,8',
    ]);

    $pin = (int) $request->pin;

    if (isset($user->pin)) {
      if (((int) $user->pin) != $pin) {
        return response()->json([
          'message' => 'PIN incorrect',
          'status' => false
        ], 403);
      }
    } else {
      return response()->json([
        'message' => 'No PIN has been set for this account',
        'status' => false,
        'has_pin' => false
      ], 403);
    }

    return [
      'message' => 'PIN verified successfully',
      'status' => true,
      'has_pin' => true
    ];
  }

  function updatePin(Request $request)
  {
    $user = $request->user();

    // Validation rules differ if setting PIN for first time versus updating existing
    if (isset($user->pin)) {
      $request->validate([
        'pin' => 'required|digits_between:4,8',
        'old_pin' => 'required|digits_between:4,8',
        'confirm_pin' => 'required|same:pin',
      ]);

      $pin = (int) $request->pin;
      $old_pin = (int) $request->old_pin;

      if (((int) $user->pin) != $old_pin) {
        return response()->json([
          'message' => 'Old PIN is incorrect',
          'status' => false
        ], 403);
      }

      if (((int) $user->pin) == $pin) {
        return response()->json([
          'message' => 'New PIN cannot be the same as your current PIN',
          'status' => false
        ], 422);
      }
    } else {
      // First time setting a PIN
      $request->validate([
        'pin' => 'required|digits_between:4,8',
        'confirm_pin' => 'required|same:pin',
      ]);

      $pin = (int) $request->pin;
    }

    $user->update(['pin' => $pin]);

    return [
      'message' => isset($user->pin) ? 'PIN updated successfully' : 'PIN created successfully',
      'status' => true,
      'has_pin' => true
    ];
  }

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
      ->whereHas('trans', fn($q) => $q->whereWithinDay('transactions'))
      ->withSum(['trans as balance_change' => fn($q) => $q->whereWithinDay('transactions')], 'amount')
      ->withSum(
        ['trans as balance_change_percentage' => fn($q) => $q->whereWithinDay('transactions')],
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

    $savingPer = $lifetime ? ($lifetime - $walletLifetime) / $lifetime * 100 : 0; // Savings Rate Percentage

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

    $users->each(fn($user) => $user->withUrls(['avatar']));

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

    $users->each(fn($user) => $user->withUrls(['avatar']));

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
      fn($q) => $q->whereId($userIdOrName),
      fn($q) => $q->whereUsername($userIdOrName)
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

    $request->merge(['device_type' => Str::lower($request->device_type)]);

    $request->validate([
      'fullname'    => '',
      'dob'         => 'date',
      'gender'      => 'in:male,female',
      'next_of_kin' => '',
      'address'     => '',
      'has_notifications'     => 'boolean',
      'player_id'   => '',
      'device_type' => 'in:ios,android,web',
      'device_name' => '',
    ]);

    $user     = $request->user();

    $user->update($request->only($user->getFillable()));

    $request->player_id && $user->updatePush(
      $request->only([
        'player_id',
        'device_type',
        'device_name'
      ])
    );

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
