<?php

namespace App\Observers;

use App\Events\Auth\UserRegistered;
use App\Jobs\User\CreateCustomer;
use App\Models\User;

class UserObserver
{
  /**
   * Handle the User "created" event.
   *
   * @param  \App\Models\User  $user
   * @return void
   */
  public function created(User $user)
  {
    $user->balance;
    $user->createWallet(['name' => 'dollar']);
    CreateCustomer::dispatch($user);
    
    // Dispatch event to trigger email verification
    event(new UserRegistered($user));
  }

  /**
   * Handle the User "updated" event.
   *
   * @param  \App\Models\User  $user
   * @return void
   */
  public function updated(User $user)
  {
    //
  }

  /**
   * Handle the User "deleted" event.
   *
   * @param  \App\Models\User  $user
   * @return void
   */
  public function deleted(User $user)
  {
    //
  }

  /**
   * Handle the User "restored" event.
   *
   * @param  \App\Models\User  $user
   * @return void
   */
  public function restored(User $user)
  {
    //
  }

  /**
   * Handle the User "force deleted" event.
   *
   * @param  \App\Models\User  $user
   * @return void
   */
  public function forceDeleted(User $user)
  {
    //
  }
}
