-- ==========================================
-- NEUROACOMPANHA PRO - Base SQL para Novo Banco de Dados
-- ==========================================
-- Instruções:
-- 1. Crie um novo projeto no Supabase (https://supabase.com)
-- 2. Acesse o SQL Editor no painel do Supabase
-- 3. Execute este script completo para criar toda a estrutura
-- 4. Copie as credenciais (URL e ANON KEY) para o arquivo .env.local
-- ==========================================

-- ==========================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ==========================================

-- Habilitar extensões do PostgreSQL (se ainda não estiverem ativas)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS
-- ==========================================

-- Tabela: Usuarios (Profissionais de Saúde)
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

-- Tabela: Sessões
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
-- 3. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Ativar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcos_desenvolvimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_tratamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_progresso ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- ==========================================

-- Políticas para usuarios (cada usuário só acessa seu próprio registro)
CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON usuarios FOR ALL
  USING (auth.uid() = id);

-- Políticas para pacientes
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
-- 5. ÍNDICES PARA PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_pacientes_usuario_id ON pacientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_paciente_id ON sessoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_marcos_paciente_id ON marcos_desenvolvimento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_planos_paciente_id ON planos_tratamento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_metricas_paciente_id ON metricas_progresso(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data_sessao);
CREATE INDEX IF NOT EXISTS idx_metricas_data ON metricas_progresso(data_registro);

-- ==========================================
-- 6. FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- ==========================================

-- Função para atualizar automaticamente o campo 'atualizado_em'
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar 'atualizado_em' em todas as tabelas
CREATE TRIGGER trigger_usuarios_atualizado_em
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_pacientes_atualizado_em
  BEFORE UPDATE ON pacientes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_sessoes_atualizado_em
  BEFORE UPDATE ON sessoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_marcos_atualizado_em
  BEFORE UPDATE ON marcos_desenvolvimento
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_planos_atualizado_em
  BEFORE UPDATE ON planos_tratamento
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_metricas_atualizado_em
  BEFORE UPDATE ON metricas_progresso
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

-- ==========================================
-- FIM DO SCRIPT - BANCO DE DADOS CONFIGURADO
-- ==========================================
