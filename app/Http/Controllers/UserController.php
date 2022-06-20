<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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

    return User
      ::with('wallets')
      ->inRandomOrder()
      ->paginate($pageSize);
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

    return User
      ::orderBy($orderBy ?? 'id', $order ?? 'asc')
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

    return User::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Http\Response
   */
  public function show(User $user)
  {
    $this->authorize('view', $user);
    return $user;
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
      'fullname'            => '',
      'profile.dob'         => 'date',
      'profile.gender'      => 'in:male,female',
      'profile.next_of_kin' => '',
      'profile.address'     => '',
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
