<?php

namespace App\Policies;

use App\Models\Saving;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SavingPolicy
{
  use HandlesAuthorization;

  /**
   * Determine whether the user can view any models.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function viewAny(User $user)
  {
    return true;
  }

  /**
   * Determine whether the user can view the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function view(User $user, Saving $saving)
  {
    return true;
  }

  /**
   * Determine whether the user can create models.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function create(User $user)
  {
    return true;
  }

  /**
   * Determine whether the user can update the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function update(User $user, Saving $saving)
  {
    return $saving->user_id == $user->id;
  }

  /**
   * Determine whether the user can delete the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function delete(User $user, Saving $saving)
  {
    return false;
  }

  /**
   * Determine whether the user can restore the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function restore(User $user, Saving $saving)
  {
    return $saving->user_id == $user->id;
  }

  /**
   * Determine whether the user can permanently delete the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Saving  $saving
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function forceDelete(User $user, Saving $saving)
  {
    return $saving->user_id == $user->id;
  }
}
