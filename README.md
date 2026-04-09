# NeuroAcompanha Pro

Sistema profissional de acompanhamento neurológico para profissionais de saúde (neuropsicólogos, psicólogos, terapeutas ocupacionais, fonoaudiólogos).

## 🚀 Início Rápido

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd neuro-acompanha-pro-development
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o Supabase

Siga o guia completo em [CONFIGURACAO.md](./CONFIGURACAO.md) para:
- Criar projeto no Supabase
- Executar script de criação do banco
- Configurar variáveis de ambiente

**Resumo:**
```bash
# 1. Crie um projeto em https://supabase.com
# 2. Execute database/schema.sql no SQL Editor do Supabase
# 3. Crie .env.local com suas credenciais:
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
```

### 4. Rode o projeto

```bash
pnpm dev
```

Acesse: **http://localhost:3000**

## 📚 Documentação

- **[CONFIGURACAO.md](./CONFIGURACAO.md)** - Guia completo de configuração
- **[database/schema.sql](./database/schema.sql)** - Script de criação do banco
- **[database/seed.sql](./database/seed.sql)** - Dados de exemplo para testes

## ✨ Funcionalidades

### ✅ Implementadas
- **Autenticação real** com Supabase Auth
- **CRUD de Pacientes** com dados persistentes
- **Registro de Sessões** com avaliação por área
- **Marcos de Desenvolvimento** (metas e conquistas)
- **Planos de Tratamento**
- **Métricas de Progresso**
- **Dashboard** com estatísticas
- **Tema Escuro/Claro**
- **Proteção de rotas** via middleware
- **Row Level Security** no banco

### 🚧 Em Desenvolvimento
- Agendamento completo
- Relatórios dinâmicos
- Análises comparativas
- Upload de avatar
- Recuperação de senha

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
|-----------|-----------|
| **Framework** | Next.js 15.2.6 (App Router) |
| **Linguagem** | TypeScript 5, React 19 |
| **Estilização** | Tailwind CSS 3.4 |
| **Componentes UI** | shadcn/ui + Radix UI |
| **Banco de Dados** | Supabase (PostgreSQL) |
| **Autenticação** | Supabase Auth |
| **Formulários** | React Hook Form + Zod |
| **Gráficos** | Recharts |

## 📁 Estrutura do Projeto

```
neuro-acompanha-pro/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout root com AuthProvider
│   ├── page.tsx             # Login
│   ├── registro/            # Registro de usuário
│   └── dashboard/           # Área logada
│       ├── page.tsx         # Dashboard
│       ├── pacientes/       # Gestão de pacientes
│       ├── agenda/          # Agendamento
│       ├── analises/        # Análises
│       └── relatorios/      # Relatórios
├── components/              # Componentes React
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Formulários (sessão, marcos)
│   └── ...
├── contexts/                # React Contexts
│   └── auth-context.tsx     # Autenticação
├── lib/                     # Utilitários
│   ├── supabase.ts          # Cliente Supabase + CRUD
│   └── supabase-auth.ts     # Funções de auth
├── database/                # Scripts SQL
│   ├── schema.sql           # Criação do banco
│   └── seed.sql             # Dados de exemplo
└── middleware.ts            # Proteção de rotas
```

## 🧪 Testando Localmente

### 1. Criar conta
```
http://localhost:3000/registro
```

### 2. Fazer login
```
http://localhost:3000
```

### 3. Adicionar dados de teste
Execute `database/seed.sql` no SQL Editor do Supabase (após substituir o ID do usuário)

## 🔐 Segurança

- **Row Level Security (RLS)**: Cada usuário só vê seus próprios dados
- **Middleware**: Rotas protegidas requerem autenticação
- **Senhas**: Armazenadas com hash seguro pelo Supabase Auth
- **Variáveis de ambiente**: Nunca commite `.env.local`

## 🚀 Deploy

### Vercel (Recomendado)

1. Push para GitHub
2. Conecte ao [Vercel](https://vercel.com)
3. Adicione variáveis de ambiente no painel do Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático!

### Outras plataformas
- Netlify
- Railway
- Render

## 📝 Licença

Este projeto é privado.

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Push e abra um Pull Request

## 📞 Suporte

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Issues do GitHub](./issues)
