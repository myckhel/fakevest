<?php

namespace App\Observers;

use App\Jobs\UserChallenge\UseJoinedChallengeJob;
use App\Jobs\UserChallenge\UserChallengeCreatedJob;
use App\Models\UserChallenge;
use App\Notifications\Challenge\Milestone;

class UserChallengeObserver
{
  /**
   * Handle the UserChallenge "created" event.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return void
   */
  public function created(UserChallenge $userChallenge)
  {
    $userChallenge->balance;
    $challenge = $userChallenge->savings;
    $user = $challenge->user;
    $participantCount = $challenge->loadCount('participants')->participants_count;

    UseJoinedChallengeJob::dispatch($userChallenge);

    if ($participantCount == 1000) {
      $user->notify(new Milestone($challenge));
    }

    UserChallengeCreatedJob::dispatch($userChallenge);
  }

  /**
   * Handle the UserChallenge "updated" event.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return void
   */
  public function updated(UserChallenge $userChallenge)
  {
    //
  }

  /**
   * Handle the UserChallenge "deleted" event.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return void
   */
  public function deleted(UserChallenge $userChallenge)
  {
    //
  }

  /**
   * Handle the UserChallenge "restored" event.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return void
   */
  public function restored(UserChallenge $userChallenge)
  {
    //
  }

  /**
   * Handle the UserChallenge "force deleted" event.
   *
   * @param  \App\Models\UserChallenge  $userChallenge
   * @return void
   */
  public function forceDeleted(UserChallenge $userChallenge)
  {
    //
  }
}
