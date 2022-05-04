<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;

class User extends Authenticatable implements HasMedia
{
  use HasApiTokens, HasFactory, Notifiable, HasImage, InteractsWithMedia;

  public function providers()
  {
    return $this->hasMany(Provider::class);
  }

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'username',
    'email',
    'password',
    'phone',
    'fullname',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
    'media'
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
    'phone' => 'int'
  ];

  public function grantMeToken()
  {
    $token          =  $this->createToken('default');

    return [
      'token'       => $token->plainTextToken,
      'token_type'  => 'Bearer',
    ];
  }

  function registerMediaCollections(): void
  {
    $mimes = ['image/jpeg', 'image/png', 'image/gif'];
    $this->addMediaCollection('avatar')
      ->acceptsMimeTypes($mimes)
      ->singleFile()->useDisk('avatars')
      ->registerMediaConversions($this->convertionCallback());
  }
}
