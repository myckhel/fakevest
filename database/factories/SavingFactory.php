<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class SavingFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    return [
      'user_id' => User::inRandomOrder()->first()->id,
      'plan_id' => Plan::inRandomOrder()->first()->id,
      'desc' => $this->faker->sentence(),
      'until' => $this->faker->dateTimeBetween('+1 week', '+5 month'),
      'times' => 1,
      'interval' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
      'amount' => $this->faker->numberBetween(10, 1000),
      'target' => $this->faker->numberBetween(1000, 100000),
    ];
  }
}
