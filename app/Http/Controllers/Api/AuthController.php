<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
	public function register(Request $request)
	{
		$validated = $request->validate([
			'name' => ['required', 'string', 'max:255'],
			'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
			'password' => ['required', 'string', 'min:8'],
			'course' => ['nullable', 'string', 'max:255'],
			'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:' . (int) date('Y') + 10],
		]);

		$user = User::create([
			'name' => $validated['name'],
			'email' => $validated['email'],
			'password' => $validated['password'],
			'course' => $validated['course'] ?? null,
			'graduation_year' => $validated['graduation_year'] ?? null,
		]);

		$token = $user->createToken('api')->plainTextToken;

		return response()->json([
			'user' => $user,
			'token' => $token,
		], 201);
	}

	public function login(Request $request)
	{
		$credentials = $request->validate([
			'email' => ['required', 'email'],
			'password' => ['required', 'string'],
		]);

		if (! Auth::attempt($credentials)) {
			return response()->json(['message' => 'Invalid credentials'], 422);
		}

		/** @var User $user */
		$user = $request->user();
		
		// Verificar se o usuário está ativo
		if (!$user->is_active) {
			Auth::logout();
			return response()->json(['message' => 'Sua conta foi desativada. Entre em contato com o administrador.'], 403);
		}
		
		// Atualizar último login
		$user->update(['last_login_at' => now()]);
		
		$token = $user->createToken('api')->plainTextToken;

		return response()->json([
			'user' => $user,
			'token' => $token,
		]);
	}

	public function social(Request $request)
	{
		$validated = $request->validate([
			'name' => ['required', 'string', 'max:255'],
			'email' => ['required', 'email', 'max:255'],
			'password' => ['required', 'string', 'min:8'],
			'course' => ['nullable', 'string', 'max:255'],
			'graduation_year' => ['nullable', 'integer', 'min:1900', 'max:' . (int) date('Y') + 10],
		]);

		$user = User::where('email', $validated['email'])->first();

		if ($user) {
			$user->name = $validated['name'];
			$user->password = $validated['password'];
			if (array_key_exists('course', $validated)) {
				$user->course = $validated['course'];
			}
			if (array_key_exists('graduation_year', $validated)) {
				$user->graduation_year = $validated['graduation_year'];
			}
			$user->save();
		} else {
			$user = User::create([
				'name' => $validated['name'],
				'email' => $validated['email'],
				'password' => $validated['password'],
				'course' => $validated['course'] ?? null,
				'graduation_year' => $validated['graduation_year'] ?? null,
			]);
		}

		$token = $user->createToken('api')->plainTextToken;

		return response()->json([
			'user' => $user,
			'token' => $token,
		]);
	}

	public function logout(Request $request)
	{
		$request->user()->currentAccessToken()->delete();
		return response()->json(['message' => 'Logged out']);
	}
}


