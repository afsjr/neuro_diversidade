# NeuroAcompanha Pro - Guia de Configuração

## Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta no Supabase (gratuita em https://supabase.com)

## Passo 1: Configurar o Banco de Dados Supabase

### 1.1 Criar um Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Organization**: Selecione ou crie uma
   - **Name**: `neuro-acompanha-pro` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte (guarde-a!)
   - **Region**: Escolha a região mais próxima (ex: `South America (Brazil)`)
5. Clique em **"Create new project"**

### 1.2 Executar o Script SQL

1. No dashboard do Supabase, vá para **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `database/schema.sql`
4. Cole no editor e clique em **"Run"** (ou pressione `Ctrl+Enter`)
5. Aguarde a criação de todas as tabelas e políticas

### 1.3 Obter as Credenciais

1. No dashboard do Supabase, vá para **Project Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. Copie os seguintes valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (chave longa)

## Passo 2: Configurar as Variáveis de Ambiente

### 2.1 Criar arquivo `.env.local`

1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Copie o conteúdo do `.env.example` ou use o modelo abaixo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

3. Substitua os valores com as credenciais obtidas no passo 1.3

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env.local` no Git
- O arquivo `.env.local` já está no `.gitignore`
- Use `.env.example` como template para outros desenvolvedores

## Passo 3: Instalar Dependências

```bash
pnpm install
```

## Passo 4: Rodar o Projeto

```bash
pnpm dev
```

O projeto estará disponível em: **http://localhost:3000**

## Passo 5: Testar Localmente

### 5.1 Criar uma Conta

1. Acesse http://localhost:3000/registro
2. Preencha o formulário com:
   - Nome completo
   - Email válido
   - CRP (formato: XX/XXXXX)
   - Especialidade
   - Senha forte (8+ caracteres, maiúscula, minúscula, número)
   - Aceite os termos
3. Clique em **"Criar Conta"**

### 5.2 Fazer Login

1. Acesse http://localhost:3000
2. Digite o email e senha que você cadastrou
3. Clique em **"Entrar"**

### 5.3 Adicionar Pacientes

1. Após o login, vá para **Dashboard** → **Pacientes**
2. Clique em **"Novo Paciente"**
3. Preencha os dados do paciente
4. Os dados serão salvos no seu banco Supabase

## Estrutura do Banco de Dados

### Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Dados dos profissionais de saúde |
| `pacientes` | Dados dos pacientes vinculados a um usuário |
| `sessoes` | Registros de sessões/atendimentos |
| `marcos_desenvolvimento` | Marcos/metas de desenvolvimento |
| `planos_tratamento` | Planos de tratamento |
| `metricas_progresso` | Métricas numéricas de progresso |

### Segurança (Row Level Security)

O banco usa **Row Level Security (RLS)** para garantir que:
- Cada usuário só vê seus próprios dados
- Pacientes são vinculados ao `usuario_id` do criador
- Sessões, marcos e métricas são acessíveis apenas através dos pacientes do usuário

## Funcionalidades Implementadas

### ✅ Autenticação Real
- Registro de usuário com Supabase Auth
- Login com email/senha
- Logout
- Sessão persistente
- Proteção de rotas via middleware

### ✅ Dados Persistentes
- CRUD completo de pacientes
- Sessões vinculadas a pacientes
- Marcos de desenvolvimento
- Planos de tratamento
- Métricas de progresso

### 🚧 Em Desenvolvimento
- Agendamento completo
- Relatórios dinâmicos
- Análises comparativas
- Upload de avatar
- Recuperação de senha

## Solução de Problemas

### Erro: "Supabase não está configurado"

**Causa:** Variáveis de ambiente não definidas

**Solução:**
1. Verifique se o arquivo `.env.local` existe
2. Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão preenchidas
3. Reinicie o servidor de desenvolvimento (`Ctrl+C` e `pnpm dev` novamente)

### Erro: "relation 'pacientes' does not exist"

**Causa:** Tabelas não criadas no Supabase

**Solução:**
1. Siga o **Passo 1.2** para executar o script SQL
2. Verifique no **Table Editor** do Supabase se as tabelas foram criadas

### Erro: "Invalid login credentials"

**Causa:** Email ou senha incorretos

**Solução:**
1. Verifique se está usando o email correto
2. Se esqueceu a senha, será necessário criar uma nova conta ou implementar recuperação de senha

### Erro: "Email already exists"

**Causa:** Email já cadastrado no Supabase

**Solução:**
1. Use um email diferente
2. Ou faça login com o email já cadastrado

### Middleware redirecionando para login mesmo após login

**Causa:** Sessão não persistindo

**Solução:**
1. Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
2. Limpe os cookies do navegador
3. Tente usar o modo anônimo do navegador

## Próximos Passos para Produção

1. **Configurar Supabase Auth Email Confirmation** (opcional)
2. **Implementar recuperação de senha**
3. **Adicionar upload de avatar**
4. **Implementar páginas de Termos de Uso e Política de Privacidade**
5. **Configurar variáveis de ambiente no Vercel/Netlify**
6. **Remover `ignoreBuildErrors` do next.config.mjs**
7. **Adicionar tratamento de erros mais robusto**
8. **Implementar testes automatizados**

## Suporte

- Documentação do Supabase: https://supabase.com/docs
- Documentação do Next.js: https://nextjs.org/docs
- Issues do GitHub: https://github.com/seu-repo/neuro-acompanha-pro/issues
