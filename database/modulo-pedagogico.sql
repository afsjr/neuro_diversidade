-- ==========================================
-- NEUROACOMPANHA PRO - Módulo Pedagógico (Padrão CSM)
-- ==========================================

-- Tabela para Acompanhamento do Desenvolvimento Estudantil
CREATE TABLE IF NOT EXISTS acompanhamento_pedagogico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id), -- Profissional que registrou
  professor_nome VARCHAR(100) NOT NULL,
  turma VARCHAR(50) NOT NULL,
  
  -- Coluna 4 do padrão CSM
  aspectos_positivos TEXT, -- Habilidades já desenvolvidas
  
  -- Coluna 5 do padrão CSM
  metas_desenvolvimento TEXT, -- Habilidades que necessitam ser desenvolvidas
  
  observacoes_gerais TEXT,
  data_registro DATE DEFAULT CURRENT_DATE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE acompanhamento_pedagogico ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Profissionais veem registros de seus pacientes" ON acompanhamento_pedagogico 
FOR SELECT USING (
  paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = auth.uid())
);

CREATE POLICY "Profissionais inserem registros" ON acompanhamento_pedagogico 
FOR INSERT WITH CHECK (
  paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = auth.uid())
);

CREATE POLICY "Profissionais editam registros" ON acompanhamento_pedagogico 
FOR UPDATE USING (
  paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = auth.uid())
);
