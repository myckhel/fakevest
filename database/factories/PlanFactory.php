<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    return [
      'name' => $this->faker->name(),
      'desc' => $this->faker->sentence(),
      'interest' => $this->faker->numberBetween(10, 30),
      'minDays' => $this->faker->numberBetween(0, 30),
      'breakable' => $this->faker->randomElement([true, false]),
    ];
  }
}
