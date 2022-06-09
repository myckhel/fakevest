<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Support\Str;

class Jsonable implements CastsAttributes
{
  /**
   * Cast the given value.
   *
   * @param  \Illuminate\Database\Eloquent\Model  $model
   * @param  string  $key
   * @param  mixed  $value
   * @param  array  $attributes
   * @return mixed
   */
  public function get($model, string $key, $value, array $attributes)
  {
    if (Str::startsWith($value, '{') && Str::endsWith($value, '}')) {
      return json_decode($value, true);
    } elseif (Str::startsWith($value, "\"")) {
      return trim($value, "\"");
    } else {
      return $value;
    }
  }

  /**
   * Prepare the given value for storage.
   *
   * @param  \Illuminate\Database\Eloquent\Model  $model
   * @param  string  $key
   * @param  mixed  $value
   * @param  array  $attributes
   * @return mixed
   */
  public function set($model, string $key, $value, array $attributes)
  {
    return json_encode($value);
  }
}
