<?php

namespace App\Models;

use Bavix\Wallet\Models\Transaction as ModelsTransaction;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends ModelsTransaction
{
  use HasFactory;

  function scopeWhereWithinDay($q, $column)
  {
    $column = $column ? "$column." : "";
    $q->where($column . "created_at", ">", Carbon::now()->subDay())->where($column . "created_at", "<", Carbon::now());
  }
}
