-- ==========================================
-- NEUROACOMPANHA PRO - Schema do Banco
-- ==========================================
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- Tabela: Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  especialidade VARCHAR(100),
  crp VARCHAR(20),
  telefone VARCHAR(20),
  avatar_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  responsavel VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(255),
  diagnostico TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'alta')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Sessoes
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  data_sessao TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao INTEGER NOT NULL,
  observacoes TEXT,
  objetivos TEXT,
  resultados TEXT,
  status VARCHAR(20) DEFAULT 'realizada' CHECK (status IN ('realizada', 'cancelada', 'agendada')),
  tipo_profissional VARCHAR(50),
  area_comportamental INTEGER CHECK (area_comportamental BETWEEN 1 AND 5),
  obs_comportamental TEXT,
  area_emocional INTEGER CHECK (area_emocional BETWEEN 1 AND 5),
  obs_emocional TEXT,
  area_motora INTEGER CHECK (area_motora BETWEEN 1 AND 5),
  obs_motora TEXT,
  area_cognitiva INTEGER CHECK (area_cognitiva BETWEEN 1 AND 5),
  obs_cognitiva TEXT,
  area_comunicacao INTEGER CHECK (area_comunicacao BETWEEN 1 AND 5),
  obs_comunicacao TEXT,
  medicacao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Marcos de Desenvolvimento
CREATE TABLE IF NOT EXISTS marcos_desenvolvimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  categoria VARCHAR(50) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_alcancado DATE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'alcancado', 'em_progresso')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Planos de Tratamento
CREATE TABLE IF NOT EXISTS planos_tratamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'pausado')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Métricas de Progresso
CREATE TABLE IF NOT EXISTS metricas_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  categoria VARCHAR(50) NOT NULL,
  valor NUMERIC(5,2) NOT NULL,
  data_registro DATE NOT NULL,
  observacao TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Políticas de Row Level Security (RLS)
-- ==========================================

-- Ativar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcos_desenvolvimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_tratamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_progresso ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios (cada usuário só vê seu próprio registro)
CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON usuarios FOR ALL
  USING (auth.uid() = id);

-- Políticas para pacientes (cada usuário só vê seus pacientes)
CREATE POLICY "Usuarios podem ver seus pacientes"
  ON pacientes FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem inserir seus pacientes"
  ON pacientes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar seus pacientes"
  ON pacientes FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar seus pacientes"
  ON pacientes FOR DELETE
  USING (auth.uid() = usuario_id);

-- Políticas para sessoes (acesso via paciente)
CREATE POLICY "Usuarios podem ver sessoes de seus pacientes"
  ON sessoes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = sessoes.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem inserir sessoes de seus pacientes"
  ON sessoes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = sessoes.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem atualizar sessoes de seus pacientes"
  ON sessoes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = sessoes.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem deletar sessoes de seus pacientes"
  ON sessoes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = sessoes.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

-- Políticas para marcos_desenvolvimento
CREATE POLICY "Usuarios podem ver marcos de seus pacientes"
  ON marcos_desenvolvimento FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = marcos_desenvolvimento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem inserir marcos de seus pacientes"
  ON marcos_desenvolvimento FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = marcos_desenvolvimento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem atualizar marcos de seus pacientes"
  ON marcos_desenvolvimento FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = marcos_desenvolvimento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem deletar marcos de seus pacientes"
  ON marcos_desenvolvimento FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = marcos_desenvolvimento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

-- Políticas para planos_tratamento
CREATE POLICY "Usuarios podem ver planos de seus pacientes"
  ON planos_tratamento FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = planos_tratamento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem inserir planos de seus pacientes"
  ON planos_tratamento FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = planos_tratamento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem atualizar planos de seus pacientes"
  ON planos_tratamento FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = planos_tratamento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem deletar planos de seus pacientes"
  ON planos_tratamento FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = planos_tratamento.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

-- Políticas para metricas_progresso
CREATE POLICY "Usuarios podem ver metricas de seus pacientes"
  ON metricas_progresso FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = metricas_progresso.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem inserir metricas de seus pacientes"
  ON metricas_progresso FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = metricas_progresso.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem atualizar metricas de seus pacientes"
  ON metricas_progresso FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = metricas_progresso.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem deletar metricas de seus pacientes"
  ON metricas_progresso FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pacientes 
      WHERE pacientes.id = metricas_progresso.paciente_id 
      AND pacientes.usuario_id = auth.uid()
    )
  );

-- ==========================================
-- Índice para performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_pacientes_usuario_id ON pacientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_paciente_id ON sessoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_marcos_paciente_id ON marcos_desenvolvimento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_planos_paciente_id ON planos_tratamento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_metricas_paciente_id ON metricas_progresso(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data_sessao);
CREATE INDEX IF NOT EXISTS idx_metricas_data ON metricas_progresso(data_registro);
