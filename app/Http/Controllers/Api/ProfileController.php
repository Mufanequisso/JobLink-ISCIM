<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
	public function me(Request $request)
	{
		return $request->user();
	}

	public function update(Request $request)
	{
		$user = $request->user();
		$validated = $request->validate([
			'name' => ['sometimes', 'string', 'max:255'],
			'course' => ['nullable', 'string', 'max:255'],
			'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:' . (int) date('Y') + 10],
			'phone' => ['nullable', 'string', 'max:50'],
			'bio' => ['nullable', 'string'],
		]);
		$user->update($validated);
		return $user->fresh();
	}

	public function updateEmploymentStatus(Request $request)
	{
		$validated = $request->validate([
			'employment_status' => ['required', 'in:employed,seeking,entrepreneur,other'],
		]);
		$request->user()->update($validated);
		return $request->user()->fresh();
	}

	public function uploadCv(Request $request)
	{
		$validated = $request->validate([
			'cv' => ['required', 'file', 'mimes:pdf', 'max:10240'],
		]);
		$path = $validated['cv']->store('cvs', 'public');
		$request->user()->update(['cv_path' => $path]);
		return response()->json(['cv_path' => $path]);
	}
}


