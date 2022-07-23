<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAccount extends Model
{
  use HasFactory;

  protected $fillable = ['type', 'user_id', 'account_number', 'account_name', 'bank_code', 'description', 'currency', 'recipient_id'];

  protected $casts = ['user_id' => 'int', 'account_number' => 'int', 'recipient_id' => 'int'];

  /**
   * Get the user that owns the UserBank
   *
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
