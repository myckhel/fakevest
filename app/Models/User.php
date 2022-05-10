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
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Traits\HasWallets;
use Bavix\Wallet\Interfaces\Wallet;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements HasMedia, Wallet
{
  use HasApiTokens, HasFactory, Notifiable, HasImage, InteractsWithMedia, HasWallet, HasWallets;

  /**
   * Get all of the payment_options for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function payment_options(): HasMany
  {
    return $this->hasMany(PaymentOption::class);
  }

  /**
   * Get all of the payments for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function payments(): HasMany
  {
    return $this->hasMany(Payment::class);
  }

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
