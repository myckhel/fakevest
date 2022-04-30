<?php

namespace App\Traits;

/**
 *
 */
trait HasImage
{
  protected $mimes = ['image/jpeg', 'image/png', 'image/gif'];

  function scopeWithUrls($q, $collections)
  {
    $q->with('media', fn ($q) => $q->whereIn('collection_name', $collections));
  }

  public function saveImage($image, $collection, $getMedia = false)
  {
    if ($image) {
      $medias = [];
      if (\is_array($image))
        foreach ($image as $img)
          $medias[] = $this->uploadImage($img, $collection);
      else $medias[] = $this->uploadImage($image, $collection);
      if ($getMedia) {
        return $medias;
      } else {
        return $this->withUrls($collection, \is_array($image), $medias);
      }
    }
  }

  private function generateCollectionUrl(&$medias, $is_array, $collection)
  {
    if ($medias) {
      $images;
      if ($is_array) {
        $images = [];
        $medias = $this->getMedia($collection);
        for ($i = 0; $i < sizeof($medias); $i++) {
          $images[] = $this->imageObj($medias[$i]);
        }
      } else {
        $images = $this->imageObj(is_array($medias) ? $medias[0] : $medias);
      }
      if ($images) $this->$collection = $images;
    }
  }

  private function generateCollectionsUrl($collection, $medias = false)
  {
    $is_array = $this->collectionIsArray($collection);
    $collection_name_is_array = is_array($collection);
    $collection_name = $collection_name_is_array ? $collection[0] : $collection;
    $collection_medias = !$medias ? ($is_array ? $this->getMedia($collection_name) : $this->getFirstMedia($collection_name)) : $medias;

    $this->generateCollectionUrl($collection_medias, $is_array, $collection_name);
  }

  public function withUrls($collections, $medias = null)
  {
    if (is_array($collections)) {
      foreach ($collections as $collection) {
        $this->generateCollectionsUrl($collection, $medias);
      }
    } else {
      $this->generateCollectionsUrl($collections, $medias);
    }
    return $this;
  }

  private function collectionIsArray($collection)
  {
    $collection = $this->getMediaCollection(is_array($collection) ? $collection[0] : $collection);

    return match ($collection->collectionSizeLimit ?? null) {
      1 => false,
      false => true,
      default => true
    };
  }

  private function imageObj($media, $fallback = false)
  {
    $image = new \stdClass();
    $fallbackUrl = 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';
    $image->thumb   = $fallback ? $fallbackUrl : $media->getUrl('thumb');
    $image->medium  = $fallback ? $fallbackUrl : $media->getUrl('medium');
    $image->url     = $fallback ? $fallbackUrl : $media->getUrl();
    $image->id      = $media->id;
    $image->metas   = $fallback ? ['fallback' => true] : ['fallback' => false] + $media->custom_properties;
    return $image;
  }

  public function uploadImage($image, $collection)
  {
    $name           = $collection;
    $type           = strpos($image, ';');
    $type           = explode(':', substr($image, 0, $type))[1];
    $ext            = explode('/', $type)[1];
    $file_name      = rand() . '.' . $ext;

    return $this->addMediaFromBase64($image)
      ->usingName($name)->usingFileName($file_name)
      ->toMediaCollection($collection);
  }

  private function convertionCallback($queued = false)
  {
    return (function () use ($queued) {
      if ($queued) {
        $this->addMediaConversion('thumb')
          ->width(368)->height(232);
        $this->addMediaConversion('medium')
          ->width(400)->height(400);
      } else {
        $this->addMediaConversion('thumb')->nonQueued()
          ->width(368)->height(232);
        $this->addMediaConversion('medium')->nonQueued()
          ->width(400)->height(400);
      }
    });
  }
}
