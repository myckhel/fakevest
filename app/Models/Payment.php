<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
  use HasFactory;

  /**
   * Get the wallet that owns the Payment
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function wallet(): BelongsTo
  {
    return $this->belongsTo(Wallet::class);
  }

  /**
   * Get the user that owns the Payment
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  protected $fillable = [
    'user_id',
    'access_code',
    'reference',
    'amount',
    'status',
    'message',
    'authorization_code',
    'currency_code',
    'paid_at',
    'wallet_id'
  ];

  protected $casts = ['user_id' => 'int', 'amount' => 'float', 'wallet_id' => 'int'];
}
