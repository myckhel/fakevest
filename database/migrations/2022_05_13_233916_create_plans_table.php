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
    Schema::create('plans', function (Blueprint $table) {
      $table->id();
      $table->string('name', 30);
      $table->string('desc');
      $table->double('interest');
      $table->integer('minDays')->nullable();
      $table->boolean('breakable')->default(true);
      $table->string('icon')->nullable();
      $table->json('colors')->default('[]');
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
    Schema::dropIfExists('plans');
  }
};
