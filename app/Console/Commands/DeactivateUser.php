<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DeactivateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:deactivate {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Desativar um usuário pelo email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        // Buscar usuário
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error('Usuário não encontrado!');
            return 1;
        }

        // Verificar se é admin
        if ($user->role === 'admin') {
            $this->warn('Atenção: Este usuário é um administrador!');
            
            if (!$this->confirm('Tem certeza que deseja desativar um administrador?')) {
                $this->info('Operação cancelada.');
                return 0;
            }
        }

        // Desativar usuário
        $user->update(['is_active' => false]);

        $this->info("Usuário {$user->name} ({$user->email}) foi desativado com sucesso!");
        $this->info("Status atual: " . ($user->is_active ? 'Ativo' : 'Inativo'));

        return 0;
    }
}
