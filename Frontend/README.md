# JobLink ISCIM - Frontend

## 🚀 Stack Tecnológica

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router DOM** para navegação
- **React Hook Form** para formulários
- **Yup** para validação
- **Axios** para requisições HTTP
- **Lucide React** para ícones

## 📦 Instalação

```bash
npm install
```

## 🏃‍♂️ Executar em Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🏗️ Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   └── Register.tsx    # Tela de cadastro
├── services/           # Serviços de API
│   └── api.ts         # Configuração do axios e serviços
├── types/              # Tipos TypeScript
│   └── index.ts       # Interfaces e tipos
├── App.tsx            # Componente principal
├── App.css            # Estilos globais
├── index.css          # Estilos do Tailwind
└── main.tsx           # Ponto de entrada
```

## 🔧 Configuração da API

A API está configurada para rodar em `http://127.0.0.1:8000/api`

### Endpoints Utilizados

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/user` - Dados do usuário

## 🎨 Design System

### Cores
- **Primary**: #1976D2 (Azul ISCIM)
- **Secondary**: #FFC107 (Amarelo)
- **Success**: #4CAF50
- **Error**: #F44336
- **Background**: #F5F5F5

### Componentes CSS
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.input-field` - Campo de entrada
- `.card` - Card com sombra

## 📝 Funcionalidades Implementadas

### ✅ Tela de Cadastro
- Formulário completo com validação
- Campos obrigatórios e opcionais
- Validação de email e senha
- Confirmação de senha
- Status de emprego
- Informações acadêmicas
- Tratamento de erros da API
- Feedback visual de sucesso/erro

### 🔄 Próximas Funcionalidades
- [ ] Tela de Login
- [ ] Dashboard do usuário
- [ ] Lista de vagas
- [ ] Perfil do usuário
- [ ] Candidaturas

## 🛠️ Scripts Disponíveis

- `npm run dev` - Executar em desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

## 🔐 Autenticação

O sistema utiliza Bearer Token para autenticação:
- Token armazenado no localStorage
- Interceptor automático para adicionar token nas requisições
- Redirecionamento automático em caso de token expirado

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🎯 Validações

- Email válido
- Senha mínima 8 caracteres
- Confirmação de senha
- Campos obrigatórios
- Ano de graduação válido
