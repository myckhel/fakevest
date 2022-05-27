<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
  private $plans = [
    ['name' => 'PiggyBank', 'desc' => 'Flexible savings on your terms. Save manually or automatically, no rules. Save daily, weekly, monthly or yearly with no limits. Interests up to 17.5% p.a', 'interest' => 17.5, 'minDays' => 0, 'breakable' => true, 'icon' => '/assets/img/plans/piggy.png'],
    ['name' => 'Vault', 'desc' => 'Lock funds for a period of time with no access to it. terms of minimum of 1 months and maximum 1 year. Returns up to 30% p.a', 'interest' => 30, 'minDays' => 5, 'breakable' => false, 'icon' => '/assets/img/plans/vault.png'],
    ['name' => 'Goals', 'desc' => 'Create, explore and smash your goals. Returns up to 12.5% p.a', 'interest' => 12.5, 'minDays' => 0, 'breakable' => true, 'icon' => '/assets/img/plans/goals.png'],
    ['name' => 'Challenge', 'desc' => 'Create or join saving Challenge, and see yourself perform better', 'interest' => 0, 'minDays' => 0, 'breakable' => true, 'icon' => '/assets/img/plans/challenge.png'],
  ];
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    collect($this->plans)->map(
      fn ($plan) => Plan::create($plan)
    );
  }
}
