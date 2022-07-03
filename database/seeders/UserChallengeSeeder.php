<?php

namespace Database\Seeders;

use App\Models\UserChallenge;
use Illuminate\Database\Seeder;

class UserChallengeSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    UserChallenge::factory(5)->create();
  }
}
