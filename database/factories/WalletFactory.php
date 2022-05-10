<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wallet>
 */
class WalletFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $name = $this->faker->word();
    return [
      'holder_type' => User::class,
      'holder_id'   => User::inRandomOrder()->first()->id,
      'name'        => $name,
      'slug'        => "/$name",
      'uuid'        => $this->faker->unique()->uuid(),
      'description' => $this->faker->sentence(3),
      'balance'     => $this->faker->numberBetween(100, 20000)
    ];
  }
}
