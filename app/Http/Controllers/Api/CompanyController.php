<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
	public function index(Request $request)
	{
		$query = Company::query();
		if ($search = $request->string('q')->toString()) {
			$query->where('name', 'like', "%$search%");
		}
		return $query->latest()->paginate(10);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'name' => ['required', 'string', 'max:255'],
			'website' => ['nullable', 'url', 'max:255'],
			'email' => ['nullable', 'email', 'max:255'],
			'description' => ['nullable', 'string'],
		]);
		$company = Company::create($validated);
		return response()->json($company, 201);
	}
}


