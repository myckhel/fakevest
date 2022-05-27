<?php

namespace Database\Seeders;

use App\Models\Saving;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SavingSeeder extends Seeder
{
  use WithoutModelEvents;

  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    Saving::factory(5)->create();
  }
}
