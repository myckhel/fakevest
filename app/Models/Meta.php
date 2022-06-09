<?php

namespace App\Models;

use App\Casts\Jsonable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Meta extends Model
{
  use HasFactory;

  protected $fillable = ['name', 'value', 'type'];
  protected $casts = ['value' => Jsonable::class];

  public function metable(): MorphTo
  {
    return $this->morphTo();
  }

  public function newCollection(array $models = array())
  {
    return new Metas($models);
  }
}

/**
 * Meta Collection Transformation
 */
class Metas extends Collection
{
  public function keyValue()
  {
    $this->items = $this->keyBy('name')->toArray();
    $this->transform(fn ($item, $key) => $item['value'] ?? '');
    return $this;
  }
}
