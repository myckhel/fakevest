<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
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

    return $user->notifications()
      ->orderBy($orderBy ?? 'id', $order ?? 'desc')
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

    return Notification::create($request->only([]));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Notification  $notification
   * @return \Illuminate\Http\Response
   */
  public function show(Notification $notification)
  {
    $this->authorize('view', $notification);
    return $notification;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Notification  $notification
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Notification $notification)
  {
    $this->authorize('update', $notification);
    $request->validate([]);
    $user     = $request->user();

    $notification->update(array_filter($request->only($notification->getFillable())));

    return $notification;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Notification  $notification
   * @return \Illuminate\Http\Response
   */
  public function destroy(Notification $notification)
  {
    $this->authorize('delete', $notification);

    $notification->delete();

    return ['status' => true];
  }
}
