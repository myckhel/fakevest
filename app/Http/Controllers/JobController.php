<?php

namespace App\Http\Controllers;

use App\Jobs\Saving\CheckUserMatured;
use Illuminate\Http\Request;
use Illuminate\Queue\Jobs\Job;

class JobController extends Controller
{
  function userSavingMatured(Request $request)
  {
    $user = $request->user();

    CheckUserMatured::dispatch($user);

    return ['message' => 'Job dispatched successfully'];
  }
}
