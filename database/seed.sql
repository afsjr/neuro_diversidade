-- ==========================================
-- NEUROACOMPANHA PRO - Dados de Teste (Seed)
-- ==========================================
-- Execute este script APÓS criar um usuário via registro no app
-- Substitua 'SEU_USUARIO_ID_AQUI' pelo ID real do usuário
-- ==========================================

-- Passo 1: Registre-se no app primeiro (http://localhost:3000/registro)
-- Passo 2: No Supabase Table Editor, copie seu ID da tabela 'usuarios'
-- Passo 3: Substitua 'SEU_USUARIO_ID_AQUI' abaixo e execute este script

-- Criar pacientes de exemplo
INSERT INTO pacientes (usuario_id, nome, data_nascimento, responsavel, telefone, email, diagnostico, status)
VALUES 
  ('SEU_USUARIO_ID_AQUI', 'João Silva', '2015-03-15', 'Maria Silva (Mãe)', '(11) 98765-4321', 'maria@email.com', 'TEA - Transtorno do Espectro Autista Nível 1', 'ativo'),
  ('SEU_USUARIO_ID_AQUI', 'Ana Oliveira', '2014-07-22', 'Carlos Oliveira (Pai)', '(11) 91234-5678', 'carlos@email.com', 'TDAH - Transtorno de Déficit de Atenção e Hiperatividade', 'ativo'),
  ('SEU_USUARIO_ID_AQUI', 'Pedro Santos', '2016-11-08', 'Fernanda Santos (Mãe)', '(11) 95555-1234', 'fernanda@email.com', 'Transtorno de Ansiedade', 'ativo'),
  ('SEU_USUARIO_ID_AQUI', 'Lucia Costa', '2013-01-30', 'Roberto Costa (Pai)', '(11) 94444-5678', 'roberto@email.com', 'Dislexia', 'ativo'),
  ('SEU_USUARIO_ID_AQUI', 'Marcos Pereira', '2015-09-12', 'Amanda Pereira (Mãe)', '(11) 93333-9876', 'amanda@email.com', 'TEA Nível 2 com atraso de fala', 'ativo');

-- Obter IDs dos pacientes (você precisará substituir pelos IDs reais após inserção)
-- Após executar o INSERT acima, execute: SELECT id FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI';

-- Criar sessões (substitua PACIENTE_ID_1, PACIENTE_ID_2, etc. pelos IDs reais)
INSERT INTO sessoes (paciente_id, data_sessao, duracao, observacoes, objetivos, resultados, status, tipo_profissional, area_comportamental, obs_comportamental, area_emocional, obs_emocional, area_motora, obs_motora, area_cognitiva, obs_cognitiva, area_comunicacao, obs_comunicacao)
VALUES 
  (
    'PACIENTE_ID_1', 
    NOW() - INTERVAL '7 days', 
    60, 
    'Sessão focada em habilidades sociais e comunicação',
    'Trabalhar interação social e reconhecimento de emoções',
    'Paciente apresentou bom progresso, conseguiu identificar 4/5 emoções',
    'realizada',
    'neuropsicologia',
    3,
    'Apresenta agitação moderada, necessita pausas',
    4,
    'Humor estável, boa regulação emocional',
    3,
    'Coordenação fina com pequenas dificuldades',
    4,
    'Boa atenção sustentada, memória preservada',
    3,
    'Comunicação verbal adequada, melhorar não-verbal'
  ),
  (
    'PACIENTE_ID_2', 
    NOW() - INTERVAL '5 days', 
    45, 
    'Avaliação cognitiva e treino de atenção',
    'Avaliar progresso em tarefas de atenção sustentada',
    'Melhora de 20% em relação à sessão anterior',
    'realizada',
    'psicologia',
    4,
    'Boa flexibilidade comportamental',
    3,
    'Alguma instabilidade emocional',
    4,
    'Boa coordenação motora',
    3,
    'Atenção dispersa nos primeiros 10 minutos',
    3,
    'Comunicação adequada, expressões faciais limitadas'
  ),
  (
    'PACIENTE_ID_3', 
    NOW() - INTERVAL '3 days', 
    60, 
    'Técnicas de relaxamento e manejo da ansiedade',
    'Ensinar técnicas de respiração e mindfulness',
    'Paciente aprendeu 2 técnicas, praticou com sucesso',
    'realizada',
    'psicologia',
    2,
    'Agitação elevada no início, melhorou ao final',
    2,
    'Ansiedade evidente, dificuldade de regulação',
    3,
    'Motricidade adequada',
    3,
    'Boa compreensão, dificuldade em manter foco',
    4,
    'Comunicação verbal excelente'
  );

-- Criar marcos de desenvolvimento
INSERT INTO marcos_desenvolvimento (paciente_id, categoria, titulo, descricao, data_alcancado, status)
VALUES 
  ('PACIENTE_ID_1', 'Comunicação', 'Primeira conversa com colega', 'Conseguiu iniciar e manter conversa de 2 minutos com colega sem mediação', NOW() - INTERVAL '2 days', 'alcancado'),
  ('PACIENTE_ID_1', 'Social', 'Participação em grupo', 'Participou de atividade em grupo de 4 pessoas por 15 minutos', NULL, 'em_progresso'),
  ('PACIENTE_ID_1', 'Comportamental', 'Controle de impulsos', 'Conseguiu aguardar sua vez em jogo por 10 minutos', NULL, 'pendente'),
  ('PACIENTE_ID_2', 'Cognitivo', 'Completar tarefa sem supervisão', 'Completou quebra-cabeça de 50 peças independentemente', NOW() - INTERVAL '10 days', 'alcancado'),
  ('PACIENTE_ID_2', 'Social', 'Respeitar vez do outro', 'Aguardou 3 rodadas de jogo sem interromper', NULL, 'em_progresso'),
  ('PACIENTE_ID_3', 'Autocuidado', 'Técnica de respiração independente', 'Usou técnica de respiração sozinho em situação de estresse', NULL, 'pendente');

-- Criar planos de tratamento
INSERT INTO planos_tratamento (paciente_id, titulo, descricao, data_inicio, data_fim, status)
VALUES 
  (
    'PACIENTE_ID_1', 
    'Desenvolvimento de Habilidades Sociais',
    'Trabalhar comunicação, interação social e reconhecimento de emoções através de jogos e role-playing',
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '90 days',
    'ativo'
  ),
  (
    'PACIENTE_ID_2',
    'Treino de Atenção e Funções Executivas',
    'Atividades estruturadas para melhorar atenção sustentada, memória de trabalho e controle inibitório',
    NOW() - INTERVAL '20 days',
    NOW() + INTERVAL '100 days',
    'ativo'
  ),
  (
    'PACIENTE_ID_3',
    'Manejo da Ansiedade',
    'Técnicas de relaxamento, respiração, mindfulness e reestruturação cognitiva',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '75 days',
    'ativo'
  );

-- Criar métricas de progresso
INSERT INTO metricas_progresso (paciente_id, categoria, valor, data_registro, observacao)
VALUES 
  ('PACIENTE_ID_1', 'Interação Social', 65, NOW() - INTERVAL '7 days', 'Escala de 0-100, melhorou 10 pontos'),
  ('PACIENTE_ID_1', 'Interação Social', 75, NOW() - INTERVAL '2 days', 'Progresso consistente'),
  ('PACIENTE_ID_1', 'Comunicação', 70, NOW() - INTERVAL '7 days', 'Escala de 0-100'),
  ('PACIENTE_ID_1', 'Comunicação', 78, NOW() - INTERVAL '2 days', 'Boa evolução'),
  ('PACIENTE_ID_2', 'Atenção', 60, NOW() - INTERVAL '10 days', 'Escala de 0-100'),
  ('PACIENTE_ID_2', 'Atenção', 72, NOW() - INTERVAL '5 days', 'Melhora significativa'),
  ('PACIENTE_ID_3', 'Ansiedade', 75, NOW() - INTERVAL '15 days', 'Escala invertida: maior = mais ansiedade'),
  ('PACIENTE_ID_3', 'Ansiedade', 65, NOW() - INTERVAL '3 days', 'Redução de 10 pontos');

-- Verificar dados inseridos
SELECT 'Pacientes criados: ' || COUNT(*) FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI';
SELECT 'Sessões criadas: ' || COUNT(*) FROM sessoes WHERE paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI');
SELECT 'Marcos criados: ' || COUNT(*) FROM marcos_desenvolvimento WHERE paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI');
SELECT 'Planos criados: ' || COUNT(*) FROM planos_tratamento WHERE paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI');
SELECT 'Métricas criadas: ' || COUNT(*) FROM metricas_progresso WHERE paciente_id IN (SELECT id FROM pacientes WHERE usuario_id = 'SEU_USUARIO_ID_AQUI');
