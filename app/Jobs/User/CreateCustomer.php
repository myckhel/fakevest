<?php

namespace App\Jobs\User;

use App\Models\User;
use Binkode\Paystack\Support\Customer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CreateCustomer implements ShouldQueue
{
  use Queueable;

  /**
   * Create a new job instance.
   */
  public function __construct(public User $user)
  {
    //
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    //
    $customer = (object) Customer::create([
      'last_name' => explode(' ', $this->user->fullname)[1] ?? '',
      'first_name'  => explode(' ', $this->user->fullname)[0],
      // prepend + if phone does not start with +
      'phone' => $this->user->phone ? (str_starts_with($this->user->phone, '+') ? $this->user->phone : '+' . $this->user->phone) : null,
      'email' => $this->user->email,
    ])['data'];

    $this->user->metas['customer_code'] = $customer->customer_code;
    $this->user->save();
  }
}
