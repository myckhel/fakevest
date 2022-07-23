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
    Schema::create('user_accounts', function (Blueprint $table) {
      $table->id();
      $table->string('type')->default('nuban');
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->string('account_number', 50);
      $table->string('account_name', 100);
      $table->string('bank_code', 100)->nullable();
      $table->string('description')->nullable();
      $table->string('currency', 10)->default('NGN');
      $table->string('recipient_id')->nullable();
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
    Schema::dropIfExists('user_accounts');
  }
};
