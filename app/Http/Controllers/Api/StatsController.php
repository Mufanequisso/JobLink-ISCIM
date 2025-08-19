<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class StatsController extends Controller
{
	public function employment()
	{
		$total = User::count();
		$counts = User::selectRaw('employment_status, COUNT(*) as count')
			->groupBy('employment_status')
			->pluck('count', 'employment_status');

		return [
			'total' => $total,
			'employed' => (int) ($counts['employed'] ?? 0),
			'seeking' => (int) ($counts['seeking'] ?? 0),
			'entrepreneur' => (int) ($counts['entrepreneur'] ?? 0),
			'other' => (int) ($counts['other'] ?? 0),
		];
	}
}


