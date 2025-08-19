<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'job_id',
		'cover_letter',
		'status',
	];

	public const STATUS_SUBMITTED = 'submitted';
	public const STATUS_REVIEWED = 'reviewed';
	public const STATUS_REJECTED = 'rejected';
	public const STATUS_ACCEPTED = 'accepted';

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function job()
	{
		return $this->belongsTo(Job::class);
	}
}


