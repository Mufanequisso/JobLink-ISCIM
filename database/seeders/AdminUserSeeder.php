<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar usuário admin padrão
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@joblink.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'admin_notes' => 'Usuário administrador padrão do sistema',
        ]);

        $this->command->info('Usuário administrador criado com sucesso!');
        $this->command->info('Email: admin@joblink.com');
        $this->command->info('Senha: admin123');
    }
}
