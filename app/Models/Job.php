<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
	use HasFactory;

	protected $table = 'job_postings';

	protected $fillable = [
		'company_id',
		'title',
		'description',
		'location',
		'type',
		'perks',
		'published_at',
		'expires_at',
	];

	protected $casts = [
		'published_at' => 'datetime',
		'expires_at' => 'datetime',
	];

	public function company()
	{
		return $this->belongsTo(Company::class);
	}

	public function applications()
	{
		return $this->hasMany(Application::class);
	}
}


