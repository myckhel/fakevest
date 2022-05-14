<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
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

    return Plan
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

    return Plan::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Plan  $plan
   * @return \Illuminate\Http\Response
   */
  public function show(Plan $plan)
  {
    $this->authorize('view', $plan);
    return $plan;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Plan  $plan
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Plan $plan)
  {
    $this->authorize('update', $plan);
    $request->validate([]);
    $user     = $request->user();

    $plan->update(array_filter($request->only($plan->getFillable())));

    return $plan;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Plan  $plan
   * @return \Illuminate\Http\Response
   */
  public function destroy(Plan $plan)
  {
    $this->authorize('delete', $plan);

    $plan->delete();

    return ['status' => true];
  }
}
