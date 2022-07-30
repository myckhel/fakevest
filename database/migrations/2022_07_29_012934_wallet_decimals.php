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
    Schema::table('transactions', function (Blueprint $table) {
      $table->decimal('amount', 64, 10)->change();
    });
    Schema::table('wallets', function (Blueprint $table) {
      $table->decimal('balance', 64, 10)->default(0)->change();
      $table->unsignedSmallInteger('decimal_places')
        ->default(10)->change();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('transactions', function (Blueprint $table) {
      $table->decimal('amount', 64, 0)->change();
    });
    Schema::table('wallets', function (Blueprint $table) {
      $table->decimal('balance', 64, 0)->default(0)->change();
      $table->unsignedSmallInteger('decimal_places')
        ->default(2)->change();
    });
  }
};
