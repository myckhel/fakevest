<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
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
