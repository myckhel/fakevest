<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Verification extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia;

  protected $fillable = ['type', 'status', 'metas'];

  protected $casts = [
    'metas' => 'json'
  ];

  protected $hidden = ['media'];

  function getFileLinks(string $collection = 'verifications')
  {
    $medias = $this->getMedia($collection);
    $this->fileLinks = collect($medias)->map(fn ($media) => $media->getUrl());
  }

  function registerMediaCollections(): void
  {
    $this->addMediaCollection('verifications')
      ->useDisk('verifications');
  }

  function user()
  {
    return $this->belongsTo(User::class);
  }
}
