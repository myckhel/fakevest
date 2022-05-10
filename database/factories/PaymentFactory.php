<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $user = User::inRandomOrder()->first();
    return [
      'user_id'             => $user->id,
      // 'wallet_id'           => $user->wallet?->id,
      'amount'              => $this->faker->randomNumber(5),
      'status'              => $this->faker->randomElement(['processing', 'on hold', 'pending', 'completed']),
      'message'             => $this->faker->randomElement(['processing', 'on hold', 'pending', 'completed']),
      'reference'           => $this->faker->sha1,
      'access_code'         => $this->faker->unique()->sha256,
      'authorization_code'  => $this->faker->sha256,
      'currency_code'       => 'NGN',
      'paid_at'             => $this->faker->dateTimeThisYear,
    ];
  }
}
