# Cronoanalise - Supabase Setup Guide

## Passos de Configuração

### 1. Criar Tabelas no Supabase

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo `supabase-setup.sql`
5. Clique em **Run** para executar

Isso criará:
- ✅ Tabela `operations` (operações do usuário)
- ✅ Tabela `processes` (processos dentro das operações)
- ✅ Tabela `measurements` (medições de tempo)
- ✅ Políticas RLS (Row Level Security) para isolamento de usuários
- ✅ Triggers automáticos

### 2. Configurar Autenticação

1. No Supabase, vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Templates**, você pode personalizar os emails de confirmação (opcional)

### 3. Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (URL do projeto)
   - **anon/public** key (chave pública)

### 4. Configurar .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...sua-chave-aqui
```

### 5. Reiniciar o Servidor

```bash
npm run dev
```

### 6. Testar

1. Abra http://localhost:5173/
2. Crie uma conta (email + senha)
3. Verifique o email de confirmação (se configurado)
4. Faça login
5. Crie uma operação
6. Crie um processo
7. Faça medições

## Hierarquia de Dados

```
👤 Usuário
  └── 📦 Operações (ex: "Linha A", "Setor Embalagem")
       └── 📋 Processos (ex: "Montagem", "Inspeção")
            └── ⏱️ Medições (tempos cronometrados)
```

## Segurança

- ✅ Row Level Security habilitado em todas as tabelas
- ✅ Cada usuário vê apenas seus próprios dados
- ✅ Políticas de segurança impedem acesso não autorizado

## Próximos Passos

Após configurar, você pode:
- Acessar de qualquer dispositivo (dados na nuvem)
- Compartilhar com equipe (cada um com conta própria)
- Backup automático pelo Supabase
