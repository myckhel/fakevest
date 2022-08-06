<?php

namespace App\Jobs\UserChallenge;

use App\Models\Saving;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckWon implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    Saving::whereHas(
      'plan',
      fn ($q) => $q->whereIn('name', ['Challenge'])
    )->active()
      ->with(['participants.user', 'plan:id,desc,interest,breakable'])
      ->where(
        fn ($q) => $q
          ->whereDate('until', '<=', Carbon::now())
          ->orWhereHas('participantWallet', fn ($q) => $q->whereColumn('balance', '>=', 'target'))
      )->chunkById(100, function ($savings) {
        $savings->map(
          function ($saving) {
            $saving->participants->map(
              fn ($p) => $p->processChallengeWon()
            );

            $saving->update(['active' => false]);
          }
        );
      });
  }
}
