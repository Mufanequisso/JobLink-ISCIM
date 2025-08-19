<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('applications', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained()->cascadeOnDelete();
			$table->foreignId('job_id')->constrained('job_postings')->cascadeOnDelete();
			$table->text('cover_letter')->nullable();
			$table->enum('status', ['submitted', 'reviewed', 'rejected', 'accepted'])->default('submitted');
			$table->timestamps();
			$table->unique(['user_id', 'job_id']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('applications');
	}
};


