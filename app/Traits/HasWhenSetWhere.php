<?php

namespace App\Traits;

/**
 * When where query scope
 */
trait HasWhenSetWhere
{
  public function scopeWhenSetWhere($q, array $wheres = [])
  {
    collect($wheres)->map(
      fn ($value, $column) =>
      $q->when($value != null, fn ($q) => $q->where($column, $value))
    );
  }
}
