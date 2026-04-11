-- ==========================================
-- NEUROACOMPANHA PRO - Atualização da Tabela Usuarios
-- ==========================================

-- Adicionando novos campos à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS formacao TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS experiencia VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Garantir que as políticas de RLS cubram os novos campos (já devem cobrir 'ALL')
