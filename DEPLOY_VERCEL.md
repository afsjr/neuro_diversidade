# 🚀 Guia de Deploy no Vercel

## Método 1: Via Interface Web (Recomendado - Mais Fácil)

### Passo 1: Conectar o Vercel ao GitHub

1. Acesse **<https://vercel.com>**
2. Clique em **"Sign Up"** ou **"Log In"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seu repositório

### Passo 2: Importar o Repositório

1. Na dashboard do Vercel, clique em **"Add New..."** > **"Project"**
2. Em **"Import Git Repository"**, localize: **`afsjr/neuro_diversidade`**
3. Clique em **"Import"**

### Passo 3: Configurar o Projeto

1. **Framework Preset**: `Next.js` (deve detectar automaticamente)
2. **Build Command**: `next build` (já configurado)
3. **Output Directory**: `.next` (já configurado)
4. **Install Command**: `pnpm install` (já configurado)

### Passo 4: Adicionar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | *(copie do arquivo `.env.local` ou do dashboard do Supabase)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(copie do arquivo `.env.local` ou do dashboard do Supabase)* |

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (~2-3 minutos)
3. Seu site estará disponível em: `https://seu-projeto.vercel.app`

---

## Método 2: Via CLI (Linha de Comando)

Se preferir usar o terminal:

```bash
# 1. Login no Vercel
vercel login

# 2. Na pasta do projeto, faça o deploy
cd /Users/itouch/Documents/projetos_escola/neuro-acompanha-pro-development
vercel

# 3. Responda as perguntas:
#    - Set up and deploy? Y
#    - Which scope? (escolha sua conta)
#    - Link to existing project? N
#    - Project name? neuro-diversidade
#    - Directory? ./

# 4. Deploy de produção
vercel --prod
```

---

## ⚠️ Problema Comum: Vercel Mostra Apenas o README

Se o deploy mostrar apenas o README em vez da aplicação:

### Causa

O Vercel não detectou corretamente que é um projeto Next.js.

### Solução

O arquivo `vercel.json` já foi adicionado ao repositório com as configurações corretas. Verifique se:

1. **O arquivo `next.config.mjs` existe** na raiz do projeto ✅
2. **O arquivo `package.json` existe** na raiz do projeto ✅
3. **O arquivo `vercel.json` existe** na raiz do projeto ✅

Se ainda assim não funcionar:

1. No dashboard do Vercel, vá em **Settings** > **General**
2. Em **Build & Development Settings**:
   - **Framework Preset**: Mude para `Next.js`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
3. Faça um novo deploy

---

## Configurações do vercel.json

O arquivo `vercel.json` configurado inclui:

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## Variáveis de Ambiente no Vercel

⚠️ **Importante**: As variáveis de ambiente do Supabase DEVEM ser configuradas no Vercel:

1. No dashboard do Vercel, clique no seu projeto
2. Vá em **Settings** > **Environment Variables**
3. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Faça um novo deploy após adicionar

---

## Após o Deploy

- O Vercel fornece uma URL como: `https://neuro-diversidade-xxx.vercel.app`
- Cada push para `main` gera um deploy automático
- Você pode configurar um domínio personalizado em **Settings** > **Domains**

---

## Logs e Debug

Se algo der errado:

1. No dashboard do Vercel, clique no **Deployment**
2. Clique em **"View Build Logs"**
3. Verifique erros de build ou runtime

---

## Links Úteis

- **Vercel Dashboard**: <https://vercel.com/dashboard>
- **Documentação Vercel**: <https://vercel.com/docs>
- **Next.js Deploy**: <https://nextjs.org/docs/deployment>
