<?php

namespace App\Observers;

use App\Models\Saving;
use App\Models\Transaction;

class TransactionObserver
{
  /**
   * Handle the Transaction "created" event.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return void
   */
  public function created(Transaction $transaction)
  {
    $wallet = $transaction->wallet;

    // if wallet can earn interest
    if (array_has([Saving::class], $wallet->holder_type)) {
      $interest = $wallet->interest()->firstOrCreate();

      if ($interest->exists) {
        $plan = $wallet->holder->plan;

        $interest->calculate($plan);
      }
    }
  }

  /**
   * Handle the Transaction "updated" event.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return void
   */
  public function updated(Transaction $transaction)
  {
    //
  }

  /**
   * Handle the Transaction "deleted" event.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return void
   */
  public function deleted(Transaction $transaction)
  {
    //
  }

  /**
   * Handle the Transaction "restored" event.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return void
   */
  public function restored(Transaction $transaction)
  {
    //
  }

  /**
   * Handle the Transaction "force deleted" event.
   *
   * @param  \App\Models\Transaction  $transaction
   * @return void
   */
  public function forceDeleted(Transaction $transaction)
  {
    //
  }
}
