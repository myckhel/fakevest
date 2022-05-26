<?php

namespace App\Listeners;

use Myckhel\Paystack\Events\Hook;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class PaystackWebHookListener implements ShouldQueue
{
  use InteractsWithQueue;

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
   * @param  \App\Events\Myckhel\Paystack\Events\Hook  $event
   * @return void
   */
  public function handle(Hook $event)
  {
    Log::debug($event->event);
  }
}
