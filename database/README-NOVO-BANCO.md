# Guia de Configuração do Novo Banco de Dados

Este guia orienta você na criação e configuração de um novo banco de dados Supabase para o projeto NeuroAcompanha Pro.

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto Supabase criado e acessível

## Passo a Passo

### 1. Criar Novo Projeto no Supabase

1. Acesse https://supabase.com
2. Faça login na sua conta
3. Clique em **"New Project"**
4. Preencha:
   - **Project name**: `neuroacompanha-pro`
   - **Database Password**: Escolha uma senha segura
   - **Region**: Selecione a região mais próxima (ex: South America)
5. Clique em **"Create new project"**

### 2. Executar o Script de Setup

1. No painel do Supabase, vá para **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Copie o conteúdo do arquivo `database/setup-novo-banco.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione `Ctrl/Cmd + Enter`)

✅ Isso criará todas as tabelas, políticas de segurança e índices.

### 3. Configurar Autenticação

1. No painel do Supabase, vá para **Authentication** > **Providers**
2. Certifique-se de que **Email** está habilitado
3. (Opcional) Configure outros providers (Google, etc.)

### 4. Obter Credenciais

1. No painel do Supabase, vá para **Project Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. Copie os seguintes valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (chave longa)

### 5. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

### 6. Testar a Conexão

1. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```
2. Acesse `http://localhost:3000`
3. Tente criar uma conta de usuário
4. Faça login e verifique se o sistema está funcionando

### 7. (Opcional) Inserir Dados de Teste

1. Após criar seu primeiro usuário, obtenha o UUID:
   - Vá para **Authentication** > **Users** no Supabase
   - Copie o **User ID** (UUID)
   
2. Abra `database/seed-novo-banco.sql`
3. Substitua `SEU_USUARIO_ID_AQUI` pelo UUID copiado
4. Execute o script no SQL Editor do Supabase

## Estrutura do Banco de Dados

### Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Profissionais de saúde (psicólogos, terapeutas) |
| `pacientes` | Pacientes vinculados ao profissional |
| `sessoes` | Registro de sessões/consultas |
| `marcos_desenvolvimento` | Marcos e marcos de desenvolvimento dos pacientes |
| `planos_tratamento` | Planos de tratamento |
| `metricas_progresso` | Métricas de progresso e evolução |

### Segurança (Row Level Security)

Todas as tabelas possuem **Row Level Security (RLS)** ativado, garantindo que:
- Cada usuário só pode acessar seus próprios dados
- Pacientes são vinculados ao usuário que os criou
- Sessões, marcos, planos e métricas são acessíveis apenas através dos pacientes do usuário

## Troubleshooting

### Erro: "relation already exists"
As tabelas já existem. Use o script existente ou limpe o banco antes de recriar.

### Erro: "auth.uid() is null"
O usuário não está autenticado. Certifique-se de fazer login pelo sistema antes de acessar os dados.

### Erro: "permission denied for table"
Verifique se as políticas RLS foram criadas corretamente. Execute novamente o script de setup.

### Não consigo encontrar meu User ID
1. Vá para **Authentication** > **Users** no Supabase Dashboard
2. Clique no email do usuário
3. Copie o valor do campo **UID**

## Scripts Disponíveis

| Arquivo | Descrição |
|---------|-----------|
| `setup-novo-banco.sql` | Script completo de criação do banco |
| `seed-novo-banco.sql` | Dados de exemplo para testes |

## Próximos Passos

- Configure backups automáticos no Supabase
- Monitore o uso e performance no dashboard
- Leia a documentação completa em `CONFIGURACAO.md` e `README.md`

---

**Dúvidas?** Consulte o `README.md` principal do projeto ou abra uma issue no repositório.
