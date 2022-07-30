<?php

namespace App\Listeners;

use App\Models\Saving;
use App\Models\Wallet;
use Bavix\Wallet\Internal\Events\BalanceUpdatedEventInterface;

class BalanceUpdatedListener
{
  /**
   * Create the event listener.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   *
   * @param  object  $event
   * @return void
   */
  public function handle(BalanceUpdatedEventInterface $event)
  {
    $wallet = Wallet::find($event->getWalletId());

    // if wallet can earn interest
    if (Saving::class == $wallet->holder_type) {
      $interest = $wallet->interest()->firstOrCreate();

      if ($interest->exists) {
        $plan = $wallet->holder->plan;

        $interest->calculate($plan);
      }
    }
  }
}
