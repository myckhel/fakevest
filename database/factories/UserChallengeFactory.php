<?php

namespace Database\Factories;

use App\Models\Saving;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserChallenge>
 */
class UserChallengeFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    return [
      'user_id'   => User::inRandomOrder()->first()->id,
      'saving_id' => Saving::whereIsChallenge()->inRandomOrder()->first()->id,
    ];
  }
}
