<?php

namespace App\Jobs\UserChallenge;

use App\Models\UserChallenge;
use App\Notifications\Challenge\Joined;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UseJoinedChallengeJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct(public UserChallenge $userChallenge)
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
    $challenge = $this->userChallenge->savings;
    $owner = $challenge->user;
    $user = $this->userChallenge->user;
    $user_id = $this->userChallenge->user_id;

    if ($owner->id != $user_id) {
      $owner->notify(new Joined($challenge, $user));
    }
  }
}
