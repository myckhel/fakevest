<?php

namespace App\Providers;

use App\Listeners\PaystackWebHookListener;
use App\Models\Saving;
use App\Models\User;
use App\Models\UserChallenge;
use App\Observers\SavingObserver;
use App\Observers\UserChallengeObserver;
use App\Observers\UserObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Myckhel\Paystack\Events\Hook;

class EventServiceProvider extends ServiceProvider
{
  /**
   * The model observers for your application.
   *
   * @var array
   */
  protected $observers = [
    Saving::class => [SavingObserver::class],
    User::class   => [UserObserver::class],
    UserChallenge::class   => [UserChallengeObserver::class],
  ];

  /**
   * The event listener mappings for the application.
   *
   * @var array<class-string, array<int, class-string>>
   */
  protected $listen = [
    Registered::class => [
      SendEmailVerificationNotification::class,
    ],
    Hook::class => [
      PaystackWebHookListener::class,
    ],
  ];

  /**
   * Register any events for your application.
   *
   * @return void
   */
  public function boot()
  {
    //
  }

  /**
   * Determine if events and listeners should be automatically discovered.
   *
   * @return bool
   */
  public function shouldDiscoverEvents()
  {
    return false;
  }
}
