-- Adicionar campos de foco escolar na tabela de pacientes
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS serie VARCHAR(50);
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS escola VARCHAR(100);
