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
    Schema::create('payments', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('wallet_id')->nullable()->constrained()->onDelete('cascade');
      $table->string('access_code')->unique();
      $table->string('reference');
      $table->decimal('amount', 9, 3);
      $table->string('status', 10)->default('pending');
      $table->string('message')->nullable();
      $table->string('authorization_code')->nullable();
      $table->string('currency_code')->nullable();
      $table->timestamp('paid_at')->nullable();
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
    Schema::dropIfExists('payments');
  }
};
