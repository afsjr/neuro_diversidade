-- ==========================================
-- NEUROACOMPANHA PRO - Tabela de Agendamentos
-- ==========================================
-- Execute este script no SQL Editor do Supabase se a tabela não existir
-- ==========================================

CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  duracao INTEGER NOT NULL DEFAULT 60,
  tipo VARCHAR(20) DEFAULT 'sessao' CHECK (tipo IN ('consulta', 'sessao', 'avaliacao')),
  status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado')),
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuarios podem ver seus agendamentos"
  ON agendamentos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem inserir seus agendamentos"
  ON agendamentos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar seus agendamentos"
  ON agendamentos FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar seus agendamentos"
  ON agendamentos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);

-- Trigger para atualizar timestamp
CREATE TRIGGER trigger_agendamentos_atualizado_em
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();
