# JobLink ISCIM - Módulos Frontend

## 📱 Estrutura de Módulos para Android/Flutter

### 1. **Módulo de Autenticação** 🔐
**Arquivos:**
- `lib/modules/auth/auth_screen.dart`
- `lib/modules/auth/login_screen.dart`
- `lib/modules/auth/register_screen.dart`
- `lib/modules/auth/auth_controller.dart`

**Funcionalidades:**
- Login com email/senha
- Registro de novo usuário
- Validação de campos
- Armazenamento seguro do token
- Logout

**Endpoints utilizados:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

---

### 2. **Módulo de Perfil do Usuário** 👤
**Arquivos:**
- `lib/modules/profile/profile_screen.dart`
- `lib/modules/profile/edit_profile_screen.dart`
- `lib/modules/profile/cv_upload_screen.dart`
- `lib/modules/profile/profile_controller.dart`

**Funcionalidades:**
- Visualizar perfil atual
- Editar informações pessoais
- Atualizar status de emprego
- Upload de CV (PDF)
- Visualizar dados acadêmicos

**Endpoints utilizados:**
- `GET /api/user`
- `PUT /api/user`
- `PUT /api/user/status`
- `POST /api/user/cv`

**Campos do perfil:**
- Nome, email, telefone
- Curso, ano de graduação
- Status de emprego (employed, seeking, entrepreneur, other)
- Bio, CV path

---

### 3. **Módulo de Empresas** 🏢
**Arquivos:**
- `lib/modules/companies/companies_screen.dart`
- `lib/modules/companies/company_detail_screen.dart`
- `lib/modules/companies/add_company_screen.dart`
- `lib/modules/companies/companies_controller.dart`

**Funcionalidades:**
- Listar empresas
- Buscar empresas por nome
- Visualizar detalhes da empresa
- Adicionar nova empresa (admin)
- Paginação

**Endpoints utilizados:**
- `GET /api/companies`
- `POST /api/companies`

**Campos da empresa:**
- Nome, website, email
- Descrição

---

### 4. **Módulo de Vagas** 💼
**Arquivos:**
- `lib/modules/jobs/jobs_screen.dart`
- `lib/modules/jobs/job_detail_screen.dart`
- `lib/modules/jobs/add_job_screen.dart`
- `lib/modules/jobs/edit_job_screen.dart`
- `lib/modules/jobs/jobs_controller.dart`

**Funcionalidades:**
- Listar vagas disponíveis
- Filtrar por tipo (full_time, part_time, internship, etc.)
- Buscar por título
- Visualizar detalhes da vaga
- Criar nova vaga (empresas)
- Editar vaga existente
- Paginação

**Endpoints utilizados:**
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs`
- `PUT /api/jobs/{id}`
- `DELETE /api/jobs/{id}`

**Campos da vaga:**
- Título, descrição, localização
- Tipo (full_time, part_time, internship, contract, temporary, remote)
- Benefícios, data de publicação, data de expiração
- Empresa relacionada

---

### 5. **Módulo de Candidaturas** 📝
**Arquivos:**
- `lib/modules/applications/my_applications_screen.dart`
- `lib/modules/applications/application_detail_screen.dart`
- `lib/modules/applications/apply_job_screen.dart`
- `lib/modules/applications/applications_controller.dart`

**Funcionalidades:**
- Visualizar minhas candidaturas
- Candidatar-se a uma vaga
- Ver status da candidatura
- Adicionar carta de apresentação
- Histórico de candidaturas

**Endpoints utilizados:**
- `GET /api/applications`
- `POST /api/jobs/{id}/apply`
- `GET /api/jobs/{id}/applications` (para empresas)

**Campos da candidatura:**
- Vaga, usuário, carta de apresentação
- Status (submitted, reviewed, rejected, accepted)
- Data de candidatura

---

### 6. **Módulo de Estatísticas** 📊
**Arquivos:**
- `lib/modules/stats/stats_screen.dart`
- `lib/modules/stats/employment_stats_screen.dart`
- `lib/modules/stats/stats_controller.dart`

**Funcionalidades:**
- Visualizar estatísticas de emprego
- Gráficos de distribuição por status
- Total de diplomados
- Percentagens por categoria

**Endpoints utilizados:**
- `GET /api/stats/employment`

**Dados exibidos:**
- Total de usuários
- Empregados, à procura, empreendedores, outros

---

## 🏗️ Estrutura de Pastas Recomendada

```
lib/
├── core/
│   ├── api/
│   │   ├── api_client.dart
│   │   ├── auth_interceptor.dart
│   │   └── endpoints.dart
│   ├── models/
│   │   ├── user.dart
│   │   ├── company.dart
│   │   ├── job.dart
│   │   └── application.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   ├── storage_service.dart
│   │   └── api_service.dart
│   └── utils/
│       ├── constants.dart
│       └── helpers.dart
├── modules/
│   ├── auth/
│   ├── profile/
│   ├── companies/
│   ├── jobs/
│   ├── applications/
│   └── stats/
├── shared/
│   ├── widgets/
│   ├── themes/
│   └── routes/
└── main.dart
```

## 🔧 Configurações Técnicas

### **API Base URL:**
```
http://127.0.0.1:8000/api
```

### **Autenticação:**
- Bearer Token
- Armazenar token localmente (SharedPreferences)
- Interceptor para adicionar token automaticamente

### **Gerenciamento de Estado:**
- GetX ou Riverpod recomendados
- Controllers para cada módulo
- Repository pattern para API calls

### **Validações:**
- Email válido
- Senha mínima 8 caracteres
- Campos obrigatórios
- Upload de CV (PDF, max 10MB)

### **Navegação:**
- Bottom Navigation para módulos principais
- Drawer para menu lateral
- Navegação por rotas nomeadas

## 📋 Checklist de Desenvolvimento

### **Fase 1 - Autenticação e Perfil**
- [ ] Tela de login
- [ ] Tela de registro
- [ ] Tela de perfil
- [ ] Edição de perfil
- [ ] Upload de CV

### **Fase 2 - Empresas e Vagas**
- [ ] Lista de empresas
- [ ] Lista de vagas
- [ ] Detalhes da vaga
- [ ] Filtros e busca

### **Fase 3 - Candidaturas**
- [ ] Minhas candidaturas
- [ ] Candidatar-se a vaga
- [ ] Status das candidaturas

### **Fase 4 - Estatísticas e Polimento**
- [ ] Dashboard de estatísticas
- [ ] Melhorias de UI/UX
- [ ] Testes e correções

## 🎨 Design Guidelines

### **Cores sugeridas:**
- Primary: #1976D2 (Azul ISCIM)
- Secondary: #FFC107 (Amarelo)
- Success: #4CAF50
- Error: #F44336
- Background: #F5F5F5

### **Tipografia:**
- Títulos: Roboto Bold
- Corpo: Roboto Regular
- Tamanhos: 16px, 14px, 12px

### **Ícones:**
- Material Design Icons
- Consistência visual
- Tamanho padrão: 24px

---

**Nota:** Este documento serve como guia para o desenvolvimento do frontend. Adapte conforme necessário para o framework escolhido (Flutter, React Native, etc.).
