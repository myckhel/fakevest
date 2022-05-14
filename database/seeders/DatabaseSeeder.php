<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
    ini_set('memory_limit', '4G');
    $this->call([
      UserSeeder::class,
      PaymentSeeder::class,
      WalletSeeder::class,
      PlanSeeder::class,
    ]);
  }
}
