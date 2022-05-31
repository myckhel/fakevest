<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
    DB::statement("ALTER TABLE `savings` CHANGE `interval` `interval` ENUM('daily', 'weekly', 'monthly', 'biannually', 'annually');");

    Schema::table('savings', function (Blueprint $table) {
      if (!Schema::hasColumn('savings', 'amount')) {
        $table->decimal('amount', 15)->default(0);
      }
      if (!Schema::hasColumn('savings', 'target')) {
        $table->decimal('target', 15)->default(0);
      }
      if (!Schema::hasColumn('savings', 'payment_plan_id')) {
        $table->integer('payment_plan_id')->nullable(true);
      }
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    DB::statement("ALTER TABLE `savings` CHANGE `interval` `interval` ENUM('daily', 'weekly', 'monthly', 'yearly');");

    Schema::table('savings', function (Blueprint $table) {
      if (Schema::hasColumn('savings', 'amount')) {
        $table->dropColumn('amount');
      }
      if (Schema::hasColumn('savings', 'target')) {
        $table->dropColumn('target');
      }
      if (Schema::hasColumn('savings', 'payment_plan_id')) {
        $table->dropColumn('payment_plan_id');
      }
    });
  }
};
