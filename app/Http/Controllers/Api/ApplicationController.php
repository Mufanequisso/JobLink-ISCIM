<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
	public function apply(Request $request, Job $job)
	{
		$validated = $request->validate([
			'cover_letter' => ['nullable', 'string'],
		]);
		$application = Application::create([
			'user_id' => $request->user()->id,
			'job_id' => $job->id,
			'cover_letter' => $validated['cover_letter'] ?? null,
			'status' => Application::STATUS_SUBMITTED,
		]);
		return response()->json($application, 201);
	}

	public function forJob(Request $request, Job $job)
	{
		return $job->applications()->with('user')->latest()->paginate(10);
	}

	public function myApplications(Request $request)
	{
		return Application::with('job.company')
			->where('user_id', $request->user()->id)
			->latest()
			->paginate(10);
	}
}


