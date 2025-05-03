<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use Illuminate\Http\Request;
use App\Traits\Api;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class ApiB extends Api
{
  function __construct($config)
  {
    parent::__construct($config);
  }

  function beforeRequest()
  {
    $now = now();

    if (isset($this->config->bearer) && Carbon::parse(Cache::get('qoreid-expiresAt'))->isAfter($now)) {
    } elseif (!isset($this->config->bearer) && Cache::get('qoreid-bearer')) {
      $this->config->bearer = Cache::get('qoreid-bearer');
      $this->config->expiresAt = Cache::get('qoreid-expiresAt');
      $this->config->tokenType = Cache::get('qoreid-tokenType');
    } else {
      $res = $this->post('token', ['clientId' => $this->config->clientId, 'secret' => $this->config->secret]);
      $at = Carbon::now()->addMinutes($res['expiresIn'])->toISOString();
      $this->config->bearer = $res['accessToken'];
      $this->config->expiresAt = $at;
      $this->config->tokenType = $res['tokenType'];

      Cache::put('qoreid-bearer', $res['accessToken']);
      Cache::put('qoreid-expiresAt', $at);
      Cache::put('qoreid-tokenType', $res['tokenType']);
    };
  }
}

class VerificationController extends Controller
{
  public function __construct()
  {
    $this->api = new ApiB(['url' => 'https://api.qoreid.com/v1', 'clientId' => config('coreid.clientId'), 'secret' => config('coreid.secret')]);
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
    $request->validate([
      'type' => 'required|in:vnin,dl,vin'
    ]);
    $user     = $request->user();

    $number = $request->number;

    $endpoint = null;
    $payload = [];

    switch ($request->type) {
      case 'nin':
        $endpoint = 'ng/identities/virtual-nin';
        $names = explode(' ', $user->fullname);
        $payload['firstname'] = $names[0];
        $payload['lastname'] = $names[1];
        break;
      case 'dl':
        $endpoint = 'ng/identities/drivers-license';
        $names = explode(' ', $user->fullname);
        $payload['firstname'] = $names[0];
        $payload['lastname'] = $names[1];
        break;
      case 'vin':
        $endpoint = 'ng/identities/vin';
        $names = explode(' ', $user->fullname);
        $payload['firstname'] = $names[0];
        $payload['lastname'] = $names[1];
        $payload['dob'] = $user->dob;
        break;
    }

    $res = $this->api->post("$endpoint/$number", $payload);

    $verification = $user->verifications()
      ->create($request->only(['type', 'metas']) + ['status' => $res['status']['status']]);

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
