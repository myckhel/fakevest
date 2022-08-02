<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Saving;
use App\Models\UserChallenge;
use Illuminate\Http\Request;

class ChallengeController extends Controller
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

    $challenges = Saving
      ::whereHas('plan', fn ($q) => $q->whereName('Challenge'))
      ->withCount(['participants', 'participant as is_joined' => fn ($q) => $q->whereBelongsTo($user)])
      ->with(['user:id,fullname', 'participantWallet' => fn ($q) => $q->where('user_challenges.user_id', $user->id)])
      ->withChallengeCompletion($user)
      ->orderBy($orderBy ?? 'until', $order ?? 'asc')
      ->paginate($pageSize);

    $challenges->map(fn ($challenge) => $challenge->withUrls('avatar'));

    return $challenges;
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $control = new SavingController;

    $request->merge(['plan_id' => Plan::whereName('Challenge')->firstOrFail()->id]);

    return $control->store($request);
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Http\Response
   */
  public function show(Request $request, Saving $challenge)
  {
    $this->authorize('view', $challenge);

    $user = $request->user();

    return $challenge
      ->loadCount(['participants', 'participant as is_joined' => fn ($q) => $q->whereBelongsTo($user)])
      ->load([
        'user:id,fullname',
        'participants' => fn ($q) => $q
          ->selectRaw("user_challenges.*, NULLIF(wallets.balance, 0) / $challenge->target * 100 as target_percentage")
          ->with(['user:id,fullname,created_at', 'wallet:id,balance,holder_type,holder_id,uuid'])
          ->leftJoin('wallets', fn ($q) => $q
            ->on('wallets.holder_id', 'user_challenges.id')
            ->whereHolderType(UserChallenge::class))
          ->orderBy('wallets.balance', 'desc'),
      ]);
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
    $request->validate([]);
    $user     = $request->user();

    $saving->update(array_filter($request->only($saving->getFillable())));

    return $saving;
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
