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
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class User extends Authenticatable implements HasMedia, Wallet
{
  use HasApiTokens, HasFactory, Notifiable, HasImage, InteractsWithMedia, HasWallet, HasWallets;

  function updatePush(array $push)
  {
    $metas = $this->metas;
    $metas['push'] = $push;
    $this->metas = $metas;
    $this->save();
    return $this;
  }

  /**
   * Get the user's has_pin.
   *
   * @return \Illuminate\Database\Eloquent\Casts\Attribute
   */
  protected function hasPin(): Attribute
  {
    return Attribute::make(
      get: fn ($value, $attributes) => isset($attributes['pin']),
    );
  }

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

  public function routeNotificationForOneSignal()
  {
    return $this->metas['push']['player_id'] ?? null;
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
    'metas'
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
    'phone' => 'int', 'profile' => Jsonable::class,
    'metas' => AsArrayObject::class,
  ];

  protected $appends = ['has_pin'];

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
