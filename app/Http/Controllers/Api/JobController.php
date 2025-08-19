<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
	public function index(Request $request)
	{
		$query = Job::with('company');
		if ($type = $request->string('type')->toString()) {
			$query->where('type', $type);
		}
		if ($q = $request->string('q')->toString()) {
			$query->where('title', 'like', "%$q%");
		}
		return $query->latest()->paginate(10);
	}

	public function show(Job $job)
	{
		return $job->load('company');
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'company_id' => ['required', 'exists:companies,id'],
			'title' => ['required', 'string', 'max:255'],
			'description' => ['required', 'string'],
			'location' => ['nullable', 'string', 'max:255'],
			'type' => ['required', 'in:full_time,part_time,internship,contract,temporary,remote'],
			'perks' => ['nullable', 'string'],
			'published_at' => ['nullable', 'date'],
			'expires_at' => ['nullable', 'date', 'after_or_equal:published_at'],
		]);
		$job = Job::create($validated);
		return response()->json($job, 201);
	}

	public function update(Request $request, Job $job)
	{
		$validated = $request->validate([
			'company_id' => ['sometimes', 'exists:companies,id'],
			'title' => ['sometimes', 'string', 'max:255'],
			'description' => ['sometimes', 'string'],
			'location' => ['nullable', 'string', 'max:255'],
			'type' => ['sometimes', 'in:full_time,part_time,internship,contract,temporary,remote'],
			'perks' => ['nullable', 'string'],
			'published_at' => ['nullable', 'date'],
			'expires_at' => ['nullable', 'date', 'after_or_equal:published_at'],
		]);
		$job->update($validated);
		return $job->fresh();
	}

	public function destroy(Job $job)
	{
		$job->delete();
		return response()->json(['message' => 'Deleted']);
	}
}


