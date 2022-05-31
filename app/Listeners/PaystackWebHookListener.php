<?php

namespace App\Listeners;

use App\Models\Payment;
use Myckhel\Paystack\Events\Hook;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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
    $eventData = (object) $event->event['data'];
    $eventname = $event->event['event'];

    match ($eventname) {
      'charge.success' => Payment::process($eventData),
    };
  }
}
