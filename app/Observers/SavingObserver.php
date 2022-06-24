<?php

namespace App\Observers;

use App\Jobs\Saving\SavingCreatedJob;
use App\Jobs\Saving\SavingUpdatedJob;
use App\Models\Saving;

class SavingObserver
{
  /**
   * Handle the Saving "created" event.
   *
   * @param  \App\Models\Saving  $saving
   * @return void
   */
  public function created(Saving $saving)
  {
    $saving->balance;
    $saving->plan->name != 'Challenge' && SavingCreatedJob::dispatch($saving);
  }

  /**
   * Handle the Saving "updated" event.
   *
   * @param  \App\Models\Saving  $saving
   * @return void
   */
  public function updated(Saving $saving)
  {
    if ($saving->wasChanged(['interval', 'amount', 'desc'])) {
      SavingUpdatedJob::dispatch($saving);
    }
  }

  /**
   * Handle the Saving "deleted" event.
   *
   * @param  \App\Models\Saving  $saving
   * @return void
   */
  public function deleted(Saving $saving)
  {
    //
  }

  /**
   * Handle the Saving "restored" event.
   *
   * @param  \App\Models\Saving  $saving
   * @return void
   */
  public function restored(Saving $saving)
  {
    //
  }

  /**
   * Handle the Saving "force deleted" event.
   *
   * @param  \App\Models\Saving  $saving
   * @return void
   */
  public function forceDeleted(Saving $saving)
  {
    //
  }
}
