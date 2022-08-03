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
    Schema::create('savings', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('plan_id')->constrained()->onDelete('cascade');
      $table->string('desc')->nullable();
      $table->string('title')->nullable();
      $table->date('until')->nullable();
      $table->integer('times')->nullable();
      $table->enum('interval', ['daily', 'weekly', 'monthly', 'biannually', 'annually'])->nullable();
      $table->decimal('amount', 15)->default(0);
      $table->decimal('target', 15)->default(0);
      $table->boolean('public')->default(true);
      $table->integer('payment_plan_id')->index()->nullable(true);
      $table->json('metas')->default("{}");
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
    Schema::dropIfExists('savings');
  }
};
