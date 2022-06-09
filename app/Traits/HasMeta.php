<?php

namespace App\Traits;

use App\Models\Meta;
use Illuminate\Support\Facades\DB;

/**
 *
 */
trait HasMeta
{
  use HasDelete;
  public function addMeta($metas, $check = [])
  {
    $meta = $this->metas()->updateOrCreate($check, $metas);
    $this->load('metas');
    return $meta;
  }

  public function addMetas($metas, $name, $value, $callback = false)
  {
    $metas = $this->load(['metas' => function ($q) use ($name) {
      $q->where('name', $name)->latest();
    }]);

    if (count($metas->metas) > 0) {
      $option = $metas->metas->first();
      $option->value = $value;
      $option->save();
    } else {
      $this->metas()->create([
        'name' => $name,
        'value' => $value,
      ]);
    }
    if ($callback) $callback($this);
    return $this;
  }

  public function metas()
  {
    return $this->morphMany(Meta::class, 'metable');
  }

  public function scopeMetas($stmt, $metas = [])
  {
    if ($metas) {
      $stmt->with(['metas' => function ($q) use ($metas) {
        $q->whereIn('name', $metas);
      }]);
    } else {
      $stmt->with(['metas']);
    }

    return $stmt;
  }

  private function isAssoc(array $arr)
  {
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
  }

  public function withMetas(array $metas = [], $select = ['name', 'value', 'type'])
  {
    $metas = $this->metas()->select($select)->where(function ($q) use ($metas) {
      if ($metas) {
        if ($this->isAssoc($metas)) {
          // $q->whereIn('name', $metas);
        } else {
          $q->whereIn('name', $metas);
        }
      } else {
      }
    })->get();

    $obj = new \stdClass();
    $metas->map(function ($meta) use (&$obj) {
      $name = $meta->name;
      // if ($meta->type) {
      //   $type = $meta->type;
      //   if (!isset($obj->$type)) {
      //     $obj->$type = new \stdClass();
      //   }
      //   $obj->$type->$name = $meta->value;
      // } else {
      $obj->$name = $meta->value;
      // }
    });

    $this->metas = $obj;

    return $this;
  }

  public function updateMetas($name, $value, $type = null)
  {
    if ($value) {
      $meta = null;
      $this->metas()->where(['name' => $name, 'type' => $type])
        ->when(1, function ($q) use (&$meta, $value, $name, $type) {
          $exists = $q->first();
          if ($exists) {
            if (is_array($value)) {
              $json_encode = 'json_encode';
              $meta = $q->update([
                'name'  => $name,
                'type'  => $type,
                'value' => DB::raw("JSON_MERGE_PATCH(`value`, '{$json_encode($value)}')")
              ]);
            } else {
              $meta = $q->update(['name' => $name, 'type' => $type, 'value' => $value]);
            }
          } else {
            $meta = $this->metas()->create(array_merge(['name' => $name, 'type' => $type], ['value' => $value]));
          }
        });
      return $meta;
    }
  }

  public static function bootHasMeta()
  {
    static::deleting(fn ($model) => static::deleteChildren($model, 'metas'));
  }
}
