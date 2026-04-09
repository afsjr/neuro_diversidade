-- ==========================================
-- NEUROACOMPANHA PRO - Dados de Exemplo (Seed)
-- ==========================================
-- Este script insere dados de exemplo para testes
-- Execute APÓS ter criado um usuário via autenticação do Supabase
-- ==========================================

-- NOTA: Substitua 'SEU_USUARIO_ID_AQUI' pelo UUID real do seu usuário
-- Você pode obter isso após fazer login no sistema

-- -- Exemplo de inserção de paciente (descomente e substitua o ID)
-- INSERT INTO pacientes (usuario_id, nome, data_nascimento, responsavel, telefone, diagnostico, status)
-- VALUES 
--   ('SEU_USUARIO_ID_AQUI', 'João Silva', '2015-03-15', 'Maria Silva', '(11) 98765-4321', 'TEA - Transtorno do Espectro Autista', 'ativo'),
--   ('SEU_USUARIO_ID_AQUI', 'Ana Oliveira', '2016-07-22', 'Carlos Oliveira', '(11) 91234-5678', 'TDAH - Transtorno de Déficit de Atenção e Hiperatividade', 'ativo'),
--   ('SEU_USUARIO_ID_AQUI', 'Pedro Santos', '2014-11-10', 'Lucia Santos', '(11) 99876-5432', 'Atraso no Desenvolvimento Neuropsicomotor', 'ativo');

-- -- Exemplo de sessões (descomente após inserir pacientes)
-- INSERT INTO sessoes (paciente_id, data_sessao, duracao, observacoes, objetivos, status, area_comportamental, area_emocional, area_motora, area_cognitiva, area_comunicacao)
-- VALUES 
--   ('PACIENTE_ID_AQUI', NOW() - INTERVAL '7 days', 50, 'Paciente apresentou boa interação durante a sessão', 'Trabalhar coordenação motora fina e interação social', 'realizada', 4, 3, 4, 4, 3),
--   ('PACIENTE_ID_AQUI', NOW() - INTERVAL '3 days', 45, 'Evolução significativa nas atividades propostas', 'Reforçar habilidades cognitivas', 'realizada', 4, 4, 3, 5, 4);

-- -- Exemplo de marcos de desenvolvimento
-- INSERT INTO marcos_desenvolvimento (paciente_id, categoria, titulo, descricao, status)
-- VALUES 
--   ('PACIENTE_ID_AQUI', 'Motor', 'Melhora na coordenação motora fina', 'Consegue recortar com tesoura com mais precisão', 'alcancado'),
--   ('PACIENTE_ID_AQUI', 'Comunicação', 'Aumento do vocabulário', 'Utiliza frases mais completas durante as sessões', 'em_progresso'),
--   ('PACIENTE_ID_AQUI', 'Social', 'Interação com colegas', 'Iniciou interação espontânea com outra criança', 'pendente');

-- -- Exemplo de planos de tratamento
-- INSERT INTO planos_tratamento (paciente_id, titulo, descricao, data_inicio, data_fim, status)
-- VALUES 
--   ('PACIENTE_ID_AQUI', 'Plano de Desenvolvimento Motor', 'Trabalhar coordenação motora fina e grossa através de atividades lúdicas', NOW(), NOW() + INTERVAL '6 months', 'ativo'),
--   ('PACIENTE_ID_AQUI', 'Plano de Habilidades Sociais', 'Desenvolver capacidade de interação e comunicação social', NOW() - INTERVAL '3 months', NOW() + INTERVAL '3 months', 'ativo');

-- -- Exemplo de métricas de progresso
-- INSERT INTO metricas_progresso (paciente_id, categoria, valor, data_registro, observacao)
-- VALUES 
--   ('PACIENTE_ID_AQUI', 'Comportamental', 4.00, NOW() - INTERVAL '7 days', 'Melhora significativa na atenção durante atividades'),
--   ('PACIENTE_ID_AQUI', 'Emocional', 3.50, NOW() - INTERVAL '7 days', 'Demonstra melhor regulação emocional'),
--   ('PACIENTE_ID_AQUI', 'Motor', 4.50, NOW() - INTERVAL '7 days', 'Excelente progresso em atividades de coordenação fina'),
--   ('PACIENTE_ID_AQUI', 'Cognitiva', 4.00, NOW() - INTERVAL '7 days', 'Boa capacidade de resolução de problemas'),
--   ('PACIENTE_ID_AQUI', 'Comunicação', 3.50, NOW() - INTERVAL '7 days', 'Aumento no uso de linguagem espontânea');

-- ==========================================
-- SCRIPT DE LIMPEZA (USE COM CUIDADO)
-- ==========================================
-- Para limpar todos os dados e recomeçar:
-- DELETE FROM metricas_progresso;
-- DELETE FROM planos_tratamento;
-- DELETE FROM marcos_desenvolvimento;
-- DELETE FROM sessoes;
-- DELETE FROM pacientes;

-- ==========================================
-- FIM DO SCRIPT DE DADOS DE EXEMPLO
-- ==========================================
