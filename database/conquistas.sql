-- ==========================================
-- NEUROACOMPANHA PRO - Sistema de Gamificação (Badges)
-- ==========================================

-- Tabela de Conquistas Definidas
CREATE TABLE IF NOT EXISTS conquistas_definicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  icone VARCHAR(50) NOT NULL, -- Nome do ícone do Lucide
  tipo VARCHAR(20) NOT NULL, -- 'paciente' ou 'profissional'
  categoria VARCHAR(50) NOT NULL, -- 'sessoes', 'marcos', 'consistencia', 'documentacao'
  requisito_valor INTEGER NOT NULL,
  cor_base VARCHAR(20) DEFAULT 'blue',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conquistas Alcançadas (Relacionamento)
CREATE TABLE IF NOT EXISTS conquistas_alcancadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conquista_id UUID REFERENCES conquistas_definicao(id) ON DELETE CASCADE,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE, -- Preenchido se tipo='paciente'
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,   -- Preenchido se tipo='profissional'
  data_conquista TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que não haja duplicatas
  UNIQUE(conquista_id, paciente_id),
  UNIQUE(conquista_id, usuario_id)
);

-- Inserção de Conquistas Iniciais
INSERT INTO conquistas_definicao (titulo, descricao, icone, tipo, categoria, requisito_valor, cor_base) VALUES
-- Paciente
('Primeiros Passos', 'Completou a 1ª sessão de jornada.', 'Footprints', 'paciente', 'sessoes', 1, 'green'),
('Explorador de Marcos', 'Alcançou os primeiros 5 marcos de desenvolvimento.', 'Trophy', 'paciente', 'marcos', 5, 'yellow'),
('Foco Total', 'Manteve 100% de presença em um mês.', 'Target', 'paciente', 'consistencia', 4, 'blue'),
('Super Superação', 'Completou 20 sessões de terapia.', 'Zap', 'paciente', 'sessoes', 20, 'purple'),

-- Profissional
('Planejador Mestre', 'Criou 10 planos de tratamento detalhados.', 'FileText', 'profissional', 'documentacao', 10, 'blue'),
('Mentor de Evolução', 'Ajudou pacientes a alcançarem 30 marcos.', 'Sparkles', 'profissional', 'marcos', 30, 'purple'),
('Guia Consistente', 'Realizou 100 sessões de atendimento.', 'ShieldCheck', 'profissional', 'sessoes', 100, 'orange');

-- Habilitar RLS
ALTER TABLE conquistas_definicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas_alcancadas ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Conquistas definição visíveis para todos" ON conquistas_definicao FOR SELECT USING (true);
CREATE POLICY "Profissionais veem suas conquistas e de seus pacientes" ON conquistas_alcancadas FOR SELECT USING (
  usuario_id = auth.uid() OR 
  paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = auth.uid())
);
