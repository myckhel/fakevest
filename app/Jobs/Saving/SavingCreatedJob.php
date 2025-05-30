<?php

namespace App\Jobs\Saving;

use App\Models\Saving;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SavingCreatedJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct(public Saving $saving)
  {
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    $saving   = $this->saving;
    $isChallenge = $saving->plan->isChallenge;

    if ($isChallenge) {
      $saving->user->challenges()->firstOrCreate(['saving_id' => $saving->id]);
    }

    !$isChallenge && $saving->processCreated();
  }
}
