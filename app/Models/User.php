<?php

namespace App\Models;

use App\Casts\Jsonable;
use App\Traits\HasImage;
use Bavix\Wallet\Interfaces\Wallet;
use App\Models\Wallet as ModelsWallet;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Traits\HasWallets;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class User extends Authenticatable implements HasMedia, Wallet
{
  use HasApiTokens, HasFactory, Notifiable, HasImage, InteractsWithMedia, HasWallet, HasWallets;

  /**
   * Get all of the challenges for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function challenges(): HasMany
  {
    return $this->hasMany(UserChallenge::class);
  }

  /**
   * Get all of the accounts for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function bankAccounts(): HasMany
  {
    return $this->hasMany(UserAccount::class);
  }

  /**
   * Get all of the savings for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function savings(): HasMany
  {
    return $this->hasMany(Saving::class);
  }

  public function savingWallet(): HasOneThrough
  {
    return $this->hasOneThrough(ModelsWallet::class, Saving::class, 'user_id', 'holder_id')->whereHolderType(Saving::class);
  }

  public function savingWallets(): HasManyThrough
  {
    return $this->hasManyThrough(ModelsWallet::class, Saving::class, 'user_id', 'holder_id')->whereHolderType(Saving::class);
  }

  /**
   * Get all of the payment_options for the User
   *
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function paymentOptions(): HasMany
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

  function verifications()
  {
    return $this->hasMany(Verification::class);
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
    'profile',
    'dob',
    'gender',
    'next_of_kin',
    'address',
    'pin',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
    'media',
    'pin',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
    'dob' => 'date',
    'phone' => 'int', 'profile' => Jsonable::class
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
