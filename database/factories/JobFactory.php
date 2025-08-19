<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
	public function definition(): array
	{
		$types = ['full_time', 'part_time', 'internship', 'contract', 'temporary', 'remote'];
		return [
			'company_id' => Company::factory(),
			'title' => fake()->jobTitle(),
			'description' => fake()->paragraphs(3, true),
			'location' => fake()->city(),
			'type' => fake()->randomElement($types),
			'perks' => fake()->sentence(),
			'published_at' => now(),
			'expires_at' => now()->addMonths(2),
		];
	}
}


