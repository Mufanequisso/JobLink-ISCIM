<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:list {--role=} {--status=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listar todos os usuários do sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $role = $this->option('role');
        $status = $this->option('status');

        $query = User::query();

        // Filtrar por role
        if ($role) {
            if (!in_array($role, ['user', 'admin'])) {
                $this->error('Role inválido. Use "user" ou "admin".');
                return 1;
            }
            $query->where('role', $role);
        }

        // Filtrar por status
        if ($status !== null) {
            $isActive = $status === 'active';
            $query->where('is_active', $isActive);
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        if ($users->isEmpty()) {
            $this->info('Nenhum usuário encontrado com os filtros aplicados.');
            return 0;
        }

        $this->info("Total de usuários encontrados: {$users->count()}");
        $this->newLine();

        // Cabeçalho da tabela
        $this->table(
            ['ID', 'Nome', 'Email', 'Função', 'Status', 'Último Login', 'Criado em'],
            $users->map(function ($user) {
                return [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role === 'admin' ? 'Admin' : 'Usuário',
                    $user->is_active ? 'Ativo' : 'Inativo',
                    $user->last_login_at ? $user->last_login_at->format('d/m/Y H:i') : 'Nunca',
                    $user->created_at->format('d/m/Y H:i'),
                ];
            })
        );

        // Estatísticas
        $this->newLine();
        $this->info('Estatísticas:');
        $this->info('- Total de usuários: ' . User::count());
        $this->info('- Administradores: ' . User::where('role', 'admin')->count());
        $this->info('- Usuários comuns: ' . User::where('role', 'user')->count());
        $this->info('- Usuários ativos: ' . User::where('is_active', true)->count());
        $this->info('- Usuários inativos: ' . User::where('is_active', false)->count());

        return 0;
    }
}
