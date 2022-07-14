<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
  use HasFactory;

  function scopeJoinWallets($q): Builder
  {
    return $q
      ->whereNotNull('target')
      ->join(
        'wallets',
        fn ($j) => $j
          ->on('wallets.holder_id', 'savings.id')->whereHolderType(self::class)
      );
  }

  /**
   * Get the user's first name.
   *
   * @return \Illuminate\Database\Eloquent\Casts\Attribute
   */
  protected function isChallenge(): Attribute
  {
    return Attribute::make(
      get: fn ($value, $props) => $props['name'] == 'Challenge',
    );
  }

  /**
   * Get all of the savings for the Plan
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function savings(): HasMany
  {
    return $this->hasMany(Saving::class);
  }

  protected $fillable = [
    'name',
    'desc',
    'interest',
    'minDays',
    'breakable',
    'icon',
    'colors',
  ];

  protected $casts = ['interest' => 'float', 'minDays' => 'int', 'breakable' => 'boolean', 'colors' => 'array'];
}
