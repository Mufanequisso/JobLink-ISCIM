# Sistema de Administração - JobLink ISCIM

Este documento explica como configurar e usar o sistema de administração do JobLink ISCIM.

## 🚀 Configuração Inicial

### 1. Executar as Migrações

```bash
php artisan migrate
```

### 2. Executar os Seeders

```bash
php artisan db:seed
```

Isso criará um usuário administrador padrão:
- **Email**: admin@joblink.com
- **Senha**: admin123

### 3. Executar o Frontend

```bash
cd Frontend
npm install
npm run dev
```

## 👑 Comandos Artisan para Administração

### Criar Usuário Administrador

```bash
php artisan user:create-admin {email} {nome} {senha}
```

Exemplo:
```bash
php artisan user:create-admin joao@empresa.com "João Silva" senha123
```

### Desativar Usuário

```bash
php artisan user:deactivate {email}
```

Exemplo:
```bash
php artisan user:deactivate usuario@email.com
```

### Listar Usuários

```bash
# Listar todos os usuários
php artisan user:list

# Listar apenas administradores
php artisan user:list --role=admin

# Listar apenas usuários ativos
php artisan user:list --status=active

# Listar apenas usuários inativos
php artisan user:list --status=inactive
```

## 🔐 Funcionalidades do Sistema

### Para Administradores

1. **Dashboard Administrativo** (`/admin`)
   - Visualizar estatísticas do sistema
   - Gerenciar todos os usuários
   - Ativar/desativar contas
   - Alterar roles (usuário/admin)
   - Adicionar observações sobre usuários
   - Deletar usuários (exceto admins)

2. **Controle de Acesso**
   - Rotas protegidas por middleware
   - Verificação de status ativo/inativo
   - Verificação de role admin

### Para Usuários Comuns

1. **Visualização de Vagas** (`/jobs`)
   - Lista de vagas disponíveis
   - Busca por título, empresa ou localização
   - Candidatura para vagas

## 🛡️ Segurança

### Middlewares Implementados

- **`auth:sanctum`**: Autenticação via token
- **`admin`**: Verifica se o usuário é administrador
- **`user.status`**: Verifica se o usuário está ativo

### Proteções

- Usuários inativos não podem fazer login
- Usuários não-admin não podem acessar rotas administrativas
- Administradores não podem deletar o último admin
- Usuários não podem desativar suas próprias contas

## 📊 Estrutura do Banco de Dados

### Campos Adicionados à Tabela Users

- `role`: Enum ('user', 'admin') - Função do usuário
- `is_active`: Boolean - Status ativo/inativo
- `last_login_at`: Timestamp - Último login
- `admin_notes`: Text - Observações do administrador

## 🔧 Desenvolvimento

### Adicionar Novas Funcionalidades Admin

1. **Backend**: Criar métodos no `ProfileController` ou criar novos controllers
2. **Frontend**: Atualizar o `AdminDashboard` ou criar novos componentes
3. **Rotas**: Adicionar em `routes/api.php` com middleware `admin`
4. **Tipos**: Atualizar `Frontend/src/types/index.ts`

### Exemplo de Nova Rota Admin

```php
// Em routes/api.php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('new-feature', [NewController::class, 'index']);
    Route::post('new-feature', [NewController::class, 'store']);
});
```

## 🚨 Troubleshooting

### Problema: Usuário não consegue fazer login

1. Verificar se a conta está ativa (`is_active = true`)
2. Verificar se o email e senha estão corretos
3. Verificar logs do Laravel

### Problema: Erro 403 ao acessar rotas admin

1. Verificar se o usuário tem role 'admin'
2. Verificar se o token está sendo enviado corretamente
3. Verificar se o middleware está registrado

### Problema: Comandos Artisan não funcionam

1. Verificar se os comandos estão registrados
2. Verificar se as classes existem
3. Executar `php artisan list` para ver comandos disponíveis

## 📝 Logs e Monitoramento

### Logs do Sistema

- Logs de autenticação: `storage/logs/laravel.log`
- Logs de acesso admin: Verificar tabela `users` campo `last_login_at`

### Monitoramento de Usuários

- Usar comando `php artisan user:list` para estatísticas
- Dashboard admin mostra estatísticas em tempo real
- Campo `admin_notes` para observações sobre usuários

## 🔄 Atualizações

### Adicionar Novos Campos

1. Criar nova migração
2. Atualizar modelo `User`
3. Atualizar tipos TypeScript
4. Atualizar componentes frontend

### Exemplo de Nova Migração

```bash
php artisan make:migration add_new_field_to_users_table
```

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('new_field')->nullable();
    });
}
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do sistema
2. Consultar este documento
3. Verificar se todas as migrações foram executadas
4. Verificar se os middlewares estão registrados corretamente

