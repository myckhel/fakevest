<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('username')->nullable()->unique();
      $table->string('phone')->nullable()->unique();
      $table->string('email')->nullable()->unique();
      $table->string('fullname');
      $table->enum('gender', ['male', 'female'])->nullable();
      $table->date('dob')->nullable();
      $table->bigInteger('pin')->nullable();
      $table->string('next_of_kin')->nullable();
      $table->string('address')->nullable();
      $table->json('profile')->nullable();
      $table->json('metas')->default("{}");
      $table->timestamp('email_verified_at')->nullable();
      $table->string('password')->nullable();
      $table->rememberToken();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('users');
  }
};
