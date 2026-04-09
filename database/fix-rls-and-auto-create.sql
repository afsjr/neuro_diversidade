-- ==========================================
-- NEUROACOMPANHA PRO - Correção de Segurança
-- ==========================================
-- EXECUTAR NO SQL EDITOR DO SUPABASE
-- Corrige: auto-create de usuarios, RLS e loop infinito
-- ==========================================

-- 1. Trigger: criar registro em 'usuarios' automaticamente
--    quando um novo usuário se registra via Supabase Auth
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Rodar trigger para usuários existentes que não têm registro em 'usuarios'
-- ==========================================
INSERT INTO public.usuarios (id, email, nome)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nome', SPLIT_PART(au.email, '@', 1))
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.usuarios)
ON CONFLICT (id) DO NOTHING;

-- 3. Corrigir RLS da tabela usuarios (separar SELECT/INSERT/UPDATE/DELETE)
-- ==========================================

-- Drop da policy antiga
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios dados" ON public.usuarios;

-- SELECT: cada usuário só vê seu próprio registro
CREATE POLICY "usuarios_select_own"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

-- INSERT: permite insert apenas com o próprio ID (para o trigger funcionar)
CREATE POLICY "usuarios_insert_own"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: cada usuário só atualiza seu próprio registro
CREATE POLICY "usuarios_update_own"
  ON public.usuarios FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: cada usuário só deleta seu próprio registro
CREATE POLICY "usuarios_delete_own"
  ON public.usuarios FOR DELETE
  USING (auth.uid() = id);

-- ==========================================
-- FIM DO SCRIPT
-- ==========================================
