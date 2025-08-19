<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\Job;
use App\Models\Application;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Users
        $users = User::factory()
            ->count(10)
            ->create();

        // Companies and Jobs
        $companies = Company::factory()->count(5)->create();

        $jobs = Job::factory()->count(12)->create([
            // company_id filled by factory default
        ]);

        // Applications
        foreach ($users as $user) {
            Application::factory()->count(2)->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
