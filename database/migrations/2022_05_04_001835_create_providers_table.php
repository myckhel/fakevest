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
    Schema::create('providers', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('provider');
      $table->string('provider_id');
      $table->string('avatar')->nullable();
      $table->timestamps();

      $table->foreignId('user_id')->constrained()->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('providers');
  }
};
