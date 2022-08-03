<?php

namespace App\Observers;

use App\Jobs\UserChallenge\UseJoinedChallengeJob;
use App\Jobs\UserChallenge\UserChallengeCreatedJob;
use App\Models\UserChallenge;

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
    UseJoinedChallengeJob::dispatch($userChallenge);
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
