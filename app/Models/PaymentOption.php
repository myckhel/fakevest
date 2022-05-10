<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentOption extends Model
{
  use HasFactory;

  /**
   * Get the user that owns the PaymentOption
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  protected $fillable = [
    "user_id",
    "authorization_code",
    "bin",
    "last4",
    "exp_month",
    "exp_year",
    "channel",
    "card_type",
    "bank",
    "country_code",
    "brand",
    "reusable",
    "signature"
  ];

  protected $casts = ['bin' => 'int', 'last4' => 'int', 'exp_month' => 'int', 'exp_year' => 'int', 'reusable' => 'bool'];
}
