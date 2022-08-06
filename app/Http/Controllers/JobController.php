<?php

namespace App\Http\Controllers;

use App\Jobs\Saving\CheckUserMatured;
use App\Jobs\UserChallenge\CheckWon;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class JobController extends Controller
{
  function userSavingMatured(Request $request)
  {
    $user = $request->user();

    CheckUserMatured::dispatch($user);

    return ['message' => 'Job dispatched successfully'];
  }

  function userChallengeWon()
  {
    $value = Cache::get('jobs.challenge.won');

    if (!$value || !Carbon::parse($value)->eq(Carbon::now()->format('Y-m-d'))) {
      CheckWon::dispatch();
      Cache::put('jobs.challenge.won', Carbon::now()->format('Y-m-d'));
      return ['message' => 'Job dispatched successfully'];
    }

    return ['message' => 'Job Already dispatched for the day'];
  }
}
