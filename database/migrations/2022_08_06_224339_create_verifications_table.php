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
    Schema::create('verifications', function (Blueprint $table) {
      $table->id();
      $table->bigInteger('user_id')->foreignId('users')->onDelete('cascade');
      $table->string('type')->default('pending');
      $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending')->index();
      $table->json('metas')->nullable();
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
    Schema::dropIfExists('verifications');
  }
};
