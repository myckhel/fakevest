<?php

namespace App\Providers;

use App\Models\Saving;
use App\Models\User;
use App\Models\UserChallenge;
use App\Observers\SavingObserver;
use App\Observers\UserChallengeObserver;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   *
   * @return void
   */
  public function register()
  {
    //
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    Saving::observe(SavingObserver::class);
    User::observe(UserObserver::class);
    UserChallenge::observe(UserChallengeObserver::class);
  }
}
