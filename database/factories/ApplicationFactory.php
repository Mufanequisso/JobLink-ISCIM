<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
	public function definition(): array
	{
		$statuses = ['submitted', 'reviewed', 'rejected', 'accepted'];
		return [
			'user_id' => User::factory(),
			'job_id' => Job::factory(),
			'cover_letter' => fake()->paragraph(),
			'status' => fake()->randomElement($statuses),
		];
	}
}


