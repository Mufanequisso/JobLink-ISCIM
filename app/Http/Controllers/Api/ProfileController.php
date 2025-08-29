<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

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

	public function allUsers(Request $request)
	{
		$users = User::select('id', 'name', 'email', 'role', 'is_active', 'last_login_at', 'admin_notes', 'created_at', 'updated_at')
			->orderBy('created_at', 'desc')
			->get();
		
		return response()->json($users);
	}

	public function updateUser(Request $request, $id)
	{
		$user = User::findOrFail($id);
		
		$validated = $request->validate([
			'role' => ['sometimes', 'in:user,admin'],
			'is_active' => ['sometimes', 'boolean'],
			'admin_notes' => ['nullable', 'string'],
		]);

		$user->update($validated);
		
		return response()->json([
			'message' => 'Usuário atualizado com sucesso',
			'user' => $user->fresh()
		]);
	}

	public function toggleUserStatus(Request $request, $id)
	{
		$user = User::findOrFail($id);
		
		// Não permitir desativar o próprio usuário
		if ($user->id === $request->user()->id) {
			return response()->json(['message' => 'Não é possível desativar sua própria conta'], 400);
		}
		
		$user->update(['is_active' => !$user->is_active]);
		
		$status = $user->is_active ? 'ativada' : 'desativada';
		
		return response()->json([
			'message' => "Conta do usuário {$status} com sucesso",
			'user' => $user->fresh()
		]);
	}

	public function deleteUser(Request $request, $id)
	{
		$user = User::findOrFail($id);
		
		// Não permitir deletar o próprio usuário
		if ($user->id === $request->user()->id) {
			return response()->json(['message' => 'Não é possível deletar sua própria conta'], 400);
		}
		
		// Não permitir deletar o último admin
		if ($user->role === 'admin') {
			$adminCount = User::where('role', 'admin')->count();
			if ($adminCount <= 1) {
				return response()->json(['message' => 'Não é possível deletar o último administrador'], 400);
			}
		}
		
		$user->delete();
		
		return response()->json(['message' => 'Usuário deletado com sucesso']);
	}
}


