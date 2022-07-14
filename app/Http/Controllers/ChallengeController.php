<?php

namespace App\Http\Controllers;

use App\Models\Saving;
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

    return Saving
      ::whereHas('plan', fn ($q) => $q->whereName('Challenge'))
      ->withCount(['participants'])
      ->withChallengeCompletion($user)
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

    return Saving::create($request->only([]));
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
    return $saving;
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
