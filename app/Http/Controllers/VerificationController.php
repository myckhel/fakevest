<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use Illuminate\Http\Request;

class VerificationController extends Controller
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

    $verifications = $user->verifications()
      ->orderBy($orderBy ?? 'id', $order ?? 'asc')
      ->paginate($pageSize);

    $verifications->map(fn ($v) => $v->getFileLinks());

    return $verifications;
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

    $verification = $user->verifications()
      ->create($request->only(['type', 'metas']));

    $verification
      ->addMultipleMediaFromRequest(['files'])
      ->each(
        fn ($fileAdder) =>
        $fileAdder->toMediaCollection('verifications')
      );

    $verification->getFileLinks();

    return $verification;
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Verification  $verification
   * @return \Illuminate\Http\Response
   */
  public function show(Verification $verification)
  {
    $verification->getFileLinks();
    return $verification;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Verification  $verification
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Verification $verification)
  {
    $request->validate([]);
    $user     = $request->user();

    $verification->update(array_filter($request->only($verification->getFillable())));

    return $verification;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Verification  $verification
   * @return \Illuminate\Http\Response
   */
  public function destroy(Verification $verification)
  {
    $verification->forceDelete();

    return ['status' => true];
  }
}
