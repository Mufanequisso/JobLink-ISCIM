# Configuração do Firebase para Autenticação Social

## 1. Criar Projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Digite um nome para o projeto (ex: "joblink-iscim")
4. Siga os passos de configuração

## 2. Configurar Autenticação

1. No painel do Firebase, vá para "Authentication" no menu lateral
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite o provedor "Google"
5. Configure o nome do projeto e email de suporte
6. Salve as configurações

## 3. Obter Credenciais

1. No painel do Firebase, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique no ícone da web (</>) para adicionar um app web
5. Digite um nome para o app (ex: "joblink-web")
6. Copie as credenciais de configuração

## 4. Configuração Atualizada ✅

As credenciais do Firebase já estão configuradas no projeto:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCcTndm3_mbCi3TR4JQSW5C-wFEuruIdIc",
  authDomain: "joblinkiscim.firebaseapp.com",
  projectId: "joblinkiscim",
  storageBucket: "joblinkiscim.firebasestorage.app",
  messagingSenderId: "338100372457",
  appId: "1:338100372457:web:7be9dd2b8ca82e2f318178",
  measurementId: "G-GFH29448SZ"
};
```

**Projeto**: joblinkiscim
**Domínio**: joblinkiscim.firebaseapp.com

## 5. Configurar Domínios Autorizados

1. No Firebase Console, vá para "Authentication" > "Settings"
2. Na aba "Authorized domains", adicione:
   - `localhost` (para desenvolvimento) ✅
   - `joblinkiscim.firebaseapp.com` (domínio do projeto) ✅
   - Seu domínio de produção (quando disponível)

## 6. Testar

1. Execute o projeto: `npm run dev`
2. Teste o login/cadastro com Google
3. Verifique se está funcionando corretamente

**Status**: ✅ Configurado e pronto para uso
**Projeto Firebase**: joblinkiscim
**Autenticação Google**: Habilitada
**Analytics**: Configurado

## Recursos Gratuitos do Firebase

- **Autenticação**: 10.000 usuários ativos por mês
- **Firestore**: 1GB de armazenamento + 50.000 leituras/dia + 20.000 escritas/dia
- **Hosting**: 10GB de armazenamento + 360MB/dia de transferência
- **Functions**: 2 milhões de invocações por mês

## Solução de Problemas

### Erro: "popup_closed_by_user"
- O usuário fechou a janela de popup
- Verifique se o popup não está sendo bloqueado pelo navegador

### Erro: "unauthorized_domain"
- O domínio não está autorizado no Firebase
- Adicione o domínio em Authentication > Settings > Authorized domains

### Erro: "popup_blocked"
- O navegador bloqueou o popup
- Use `signInWithRedirect` como alternativa para dispositivos móveis

## Alternativas Gratuitas

Se preferir não usar Firebase, outras opções gratuitas incluem:

1. **Auth0** - 7.000 usuários ativos gratuitos
2. **Supabase** - Autenticação social gratuita
3. **Appwrite** - Open source, self-hosted
4. **NextAuth.js** - Para projetos Next.js

## Segurança

- Nunca compartilhe suas credenciais do Firebase
- Use variáveis de ambiente para as credenciais em produção
- Configure regras de segurança adequadas no Firestore
- Monitore o uso da API para evitar exceder os limites gratuitos
