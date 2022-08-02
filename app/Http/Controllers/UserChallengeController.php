<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use App\Models\UserChallenge;
use Illuminate\Http\Request;

class UserChallengeController extends Controller
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

    return UserChallenge
      ::orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->paginate($pageSize);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request, $saving)
  {
    $challenge = Saving::whereId($saving)->whereIsChallenge()->firstOrFail();
    $request->validate([
      'metas' => 'array'
    ]);
    $user     = $request->user();

    return $user->challenges()->firstOrCreate(['saving_id' => $challenge->id], ['saving_id' => $challenge->id, 'metas' => $request->metas]);
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return \Illuminate\Http\Response
   */
  public function show(UserChallenge $userChallenge)
  {
    $this->authorize('view', $userChallenge);
    return $userChallenge;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, UserChallenge $userChallenge)
  {
    $this->authorize('update', $userChallenge);
    $request->validate([]);
    $user     = $request->user();

    $userChallenge->update(array_filter($request->only($userChallenge->getFillable())));

    return $userChallenge;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return \Illuminate\Http\Response
   */
  public function destroy(UserChallenge $userChallenge)
  {
    $this->authorize('delete', $userChallenge);

    $userChallenge->delete();

    return ['status' => true];
  }
}
