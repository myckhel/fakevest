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
    Schema::table('users', function (Blueprint $table) {
      $table->enum('gender', ['male', 'female'])->nullable();
      $table->date('dob')->nullable();
      $table->string('next_of_kin')->nullable();
      $table->string('address')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['gender', 'dob', 'next_of_kin', 'address'])->nullable();
    });
  }
};
