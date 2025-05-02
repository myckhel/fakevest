<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendEmailVerificationListener implements ShouldQueue
{
  use InteractsWithQueue;

  /**
   * The number of times the job may be attempted.
   *
   * @var int
   */
  public $tries = 3;

  /**
   * Create the event listener.
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   */
  public function handle(UserRegistered $event): void
  {
    if (!$event->user->hasVerifiedEmail()) {
      $event->user->sendEmailVerificationNotification();
    }
  }
}
