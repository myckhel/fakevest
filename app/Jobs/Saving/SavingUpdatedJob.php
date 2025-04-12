<?php

namespace App\Jobs\Saving;

use App\Models\Saving;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Binkode\Paystack\Support\Plan;

class SavingUpdatedJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct(public Saving $saving)
  {
    //
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    $saving = $this->saving;

    Plan::update(
      $saving->payment_plan_id,
      [
        'name'        => $saving->desc,
        'description' => $saving->desc,
        'amount'      => $saving->amount * 10,
        'interval'    => $saving->interval,
      ]
    );
  }
}
