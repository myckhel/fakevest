<?php

namespace App\Jobs\Saving;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckUserMatured implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct(public User $user)
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
    $user = $this->user;

    $user->savings()->whereHas(
      'plan',
      fn ($q) => $q->whereIn('name', ['Vault', 'Goals'])
    )->active()
      ->with(['user:id,fullname', 'wallet.interest', 'plan:id,desc,interest,breakable'])
      ->where(
        fn ($q) => $q
          ->whereDate('until', '<=', Carbon::now())
          ->orWhereHas('wallet', fn ($q) => $q->whereColumn('balance', '>=', 'target'))
      )->chunkById(100, function ($savings) {
        $savings->map(fn ($saving) => $saving->processMatured());
      });
  }
}
