<?php

namespace App\Jobs\Saving;

use App\Models\PaymentOption;
use App\Models\Saving;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Myckhel\Paystack\Support\Charge;
use Myckhel\Paystack\Support\Plan;
use Myckhel\Paystack\Support\Subscription;

class SavingCreatedJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct(public Saving $saving)
  {
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    $saving   = $this->saving;
    $email    = $saving->user->email;

    if ($saving->interval) {
      $plan = (object) Plan::create([
        'name'        => $saving->desc,
        'description' => $saving->desc,
        'amount'      => $saving->amount * 10,
        'interval'    => $saving->interval,
      ])['data'];

      Subscription::create([
        'plan'        => $plan->plan_code,
        'customer'    => $email,
        'start_date'  => Carbon::now()->addSeconds(40)->toIso8601String(),
      ]);

      $saving->update(['payment_plan_id' => $plan->id]);
    } elseif ($saving->metas['payment_option_id']) {
      $option = PaymentOption::find($saving->metas['payment_option_id']);

      $option && Charge::create([
        'authorization_code'  => $option->authorization_code,
        'amount'              => $saving->amount,
        'email'               => $saving->user->email,
        'metadata'            => ['saving_id' => $saving->id]
      ]);
    }
  }
}
