# 🗄️ Configuração MySQL para JobLink-ISCIM

## 📋 Pré-requisitos
- MySQL 8.0+ instalado e rodando
- PHP com extensão `pdo_mysql` habilitada
- Composer instalado

## 🚀 Passos para Configurar

### 1. Criar o Banco de Dados
```bash
# Conectar ao MySQL
mysql -u root -p

# Executar o script de criação
source database/create-mysql-database.sql
```

### 2. Configurar o Arquivo .env
Copie o conteúdo de `database-config-mysql.txt` para um arquivo `.env` na raiz do projeto.

**IMPORTANTE**: Ajuste as seguintes variáveis:
```env
DB_USERNAME=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_HOST=127.0.0.1  # ou IP do seu servidor MySQL
DB_PORT=3306        # porta padrão do MySQL
```

### 3. Gerar Chave da Aplicação
```bash
php artisan key:generate
```

### 4. Executar as Migrations
```bash
php artisan migrate
```

### 5. Executar os Seeders (opcional)
```bash
php artisan db:seed
```

## 🔧 Verificações

### Verificar Conexão
```bash
php artisan tinker
# No tinker, execute:
DB::connection()->getPdo();
```

### Verificar Tabelas
```bash
php artisan migrate:status
```

## 🐛 Solução de Problemas

### Erro: "Class 'PDO' not found"
```bash
# Instalar extensão PDO MySQL
sudo apt-get install php-mysql  # Ubuntu/Debian
# ou
sudo yum install php-mysql      # CentOS/RHEL
```

### Erro: "Access denied for user"
- Verifique se o usuário tem permissões no banco
- Execute: `GRANT ALL PRIVILEGES ON joblink_iscim.* TO 'seu_usuario'@'localhost';`

### Erro: "Connection refused"
- Verifique se o MySQL está rodando
- Verifique se a porta está correta
- Verifique firewall/iptables

## 📊 Estrutura das Tabelas
Após executar as migrations, você terá:
- `users` - Usuários do sistema
- `companies` - Empresas
- `job_postings` - Vagas de emprego
- `applications` - Candidaturas
- `jobs` - Sistema de filas do Laravel

## 🔄 Voltar para SQLite
Se quiser voltar para SQLite:
1. Altere `DB_CONNECTION=sqlite` no `.env`
2. Delete o arquivo `.env`
3. Execute `php artisan migrate:fresh`
