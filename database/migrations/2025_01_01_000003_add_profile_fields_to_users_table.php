<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::table('users', function (Blueprint $table) {
			$table->string('course')->nullable()->after('name');
			$table->year('graduation_year')->nullable()->after('course');
			$table->enum('employment_status', ['employed', 'seeking', 'entrepreneur', 'other'])->default('seeking')->after('graduation_year');
			$table->string('phone')->nullable()->after('employment_status');
			$table->string('cv_path')->nullable()->after('phone');
			$table->text('bio')->nullable()->after('cv_path');
		});
	}

	public function down(): void
	{
		Schema::table('users', function (Blueprint $table) {
			$table->dropColumn(['course', 'graduation_year', 'employment_status', 'phone', 'cv_path', 'bio']);
		});
	}
};


