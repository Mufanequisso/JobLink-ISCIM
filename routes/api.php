<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\StatsController;

Route::prefix('auth')->group(function () {
	Route::post('register', [AuthController::class, 'register']);
	Route::post('login', [AuthController::class, 'login']);
	Route::post('social', [AuthController::class, 'social']);
	Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
	// Profile
	Route::get('user', [ProfileController::class, 'me']);
	Route::put('user', [ProfileController::class, 'update']);
	Route::put('user/status', [ProfileController::class, 'updateEmploymentStatus']);
	Route::post('user/cv', [ProfileController::class, 'uploadCv']);

	// Applications
	Route::get('applications', [ApplicationController::class, 'myApplications']);
});

// Public resources
Route::get('companies', [CompanyController::class, 'index']);
Route::post('companies', [CompanyController::class, 'store'])->middleware('auth:sanctum');

Route::get('jobs', [JobController::class, 'index']);
Route::get('jobs/{job}', [JobController::class, 'show']);
Route::post('jobs', [JobController::class, 'store'])->middleware('auth:sanctum');
Route::put('jobs/{job}', [JobController::class, 'update'])->middleware('auth:sanctum');
Route::delete('jobs/{job}', [JobController::class, 'destroy'])->middleware('auth:sanctum');

Route::post('jobs/{job}/apply', [ApplicationController::class, 'apply'])->middleware('auth:sanctum');
Route::get('jobs/{job}/applications', [ApplicationController::class, 'forJob'])->middleware('auth:sanctum');

// Stats
Route::get('stats/employment', [StatsController::class, 'employment']);


