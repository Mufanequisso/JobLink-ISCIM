<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-admin {email} {name} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Criar um novo usuário administrador';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->argument('name');
        $password = $this->argument('password');

        // Validar dados
        $validator = Validator::make([
            'email' => $email,
            'name' => $name,
            'password' => $password,
        ], [
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // Verificar se o usuário já existe
        if (User::where('email', $email)->exists()) {
            $this->error('Usuário com este email já existe!');
            return 1;
        }

        // Criar usuário admin
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
            'is_active' => true,
            'admin_notes' => 'Usuário administrador criado via comando Artisan',
        ]);

        $this->info("Usuário administrador criado com sucesso!");
        $this->info("ID: {$user->id}");
        $this->info("Nome: {$user->name}");
        $this->info("Email: {$user->email}");
        $this->info("Função: {$user->role}");
        $this->info("Status: " . ($user->is_active ? 'Ativo' : 'Inativo'));

        return 0;
    }
}
