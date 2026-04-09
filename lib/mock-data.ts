// ==========================================
// NEUROACOMPANHA PRO - Dados Mock (Demonstração)
// ==========================================
// Este arquivo simula um banco de dados local usando localStorage
// Substitua pelo Supabase real quando estiver pronto para produção
// ==========================================

import type {
  Usuario,
  Paciente,
  Sessao,
  MarcoDesenvolvimento,
  PlanoTratamento,
  MetricaProgresso,
} from '@/lib/supabase'

// ==========================================
// Interfaces para Auth Mock
// ==========================================

export interface AuthUser {
  id: string
  email: string
  nome: string
  especialidade?: string
  criado_em: string
}

// ==========================================
// Storage Keys
// ==========================================

const STORAGE_KEYS = {
  AUTH_USER: 'neuro_auth_user',
  AUTH_SESSION: 'neuro_auth_session',
  USUARIOS: 'neuro_usuarios',
  PACIENTES: 'neuro_pacientes',
  SESSOES: 'neuro_sessoes',
  MARCOS: 'neuro_marcos',
  PLANOS: 'neuro_planos',
  METRICAS: 'neuro_metricas',
}

// ==========================================
// Funções Auxiliares de Storage
// ==========================================

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Erro ao ler storage ${key}:`, error)
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar storage ${key}:`, error)
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

// ==========================================
// Inicializar com dados de demonstração
// ==========================================

function initializeDemoData() {
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  
  // Se já tem dados, não inicializa de novo
  if (pacientes.length > 0) return

  // Criar usuário demo
  const demoUsuario: Usuario = {
    id: 'demo-user-001',
    email: 'demo@neuroacompanha.com',
    nome: 'Dra. Ana Neuropsicóloga',
    especialidade: 'Neuropsicologia',
    criado_em: now(),
    atualizado_em: now(),
  }

  // Criar pacientes demo
  const demoPacientes: Paciente[] = [
    {
      id: 'pac-001',
      usuario_id: 'demo-user-001',
      nome: 'João Silva',
      data_nascimento: '2015-03-15',
      responsavel: 'Maria Silva (Mãe)',
      telefone: '(11) 98765-4321',
      email: 'maria@email.com',
      diagnostico: 'TEA - Transtorno do Espectro Autista Nível 1',
      status: 'ativo',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'pac-002',
      usuario_id: 'demo-user-001',
      nome: 'Ana Oliveira',
      data_nascimento: '2014-07-22',
      responsavel: 'Carlos Oliveira (Pai)',
      telefone: '(11) 91234-5678',
      email: 'carlos@email.com',
      diagnostico: 'TDAH - Transtorno de Déficit de Atenção e Hiperatividade',
      status: 'ativo',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'pac-003',
      usuario_id: 'demo-user-001',
      nome: 'Pedro Santos',
      data_nascimento: '2016-11-08',
      responsavel: 'Fernanda Santos (Mãe)',
      telefone: '(11) 95555-1234',
      email: 'fernanda@email.com',
      diagnostico: 'Transtorno de Ansiedade',
      status: 'ativo',
      criado_em: now(),
      atualizado_em: now(),
    },
  ]

  // Criar sessões demo
  const demoSessoes: Sessao[] = [
    {
      id: 'sess-001',
      paciente_id: 'pac-001',
      data_sessao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duracao: 60,
      observacoes: 'Sessão focada em habilidades sociais e comunicação. Paciente apresentou bom progresso.',
      objetivos: 'Trabalhar interação social e reconhecimento de emoções',
      resultados: 'Conseguiu identificar 4/5 emoções corretamente',
      status: 'realizada',
      tipo_profissional: 'neuropsicologia',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'sess-002',
      paciente_id: 'pac-002',
      data_sessao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duracao: 45,
      observacoes: 'Avaliação cognitiva e treino de atenção. Melhora de 20% em relação à sessão anterior.',
      objetivos: 'Avaliar progresso em tarefas de atenção sustentada',
      resultados: 'Progresso consistente observado',
      status: 'realizada',
      tipo_profissional: 'psicologia',
      criado_em: now(),
      atualizado_em: now(),
    },
  ]

  // Criar marcos demo
  const demoMarcos: MarcoDesenvolvimento[] = [
    {
      id: 'marco-001',
      paciente_id: 'pac-001',
      categoria: 'Comunicação',
      titulo: 'Primeira conversa com colega',
      descricao: 'Conseguiu iniciar e manter conversa de 2 minutos com colega sem mediação',
      data_alcancado: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'alcancado',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'marco-002',
      paciente_id: 'pac-001',
      categoria: 'Social',
      titulo: 'Participação em grupo',
      descricao: 'Participar de atividade em grupo de 4 pessoas por 15 minutos',
      status: 'em_progresso',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'marco-003',
      paciente_id: 'pac-002',
      categoria: 'Cognitivo',
      titulo: 'Completar tarefa sem supervisão',
      descricao: 'Completar quebra-cabeça de 50 peças independentemente',
      data_alcancado: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'alcancado',
      criado_em: now(),
      atualizado_em: now(),
    },
  ]

  // Criar planos demo
  const demoPlanos: PlanoTratamento[] = [
    {
      id: 'plano-001',
      paciente_id: 'pac-001',
      titulo: 'Desenvolvimento de Habilidades Sociais',
      descricao: 'Trabalhar comunicação, interação social e reconhecimento de emoções',
      data_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ativo',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'plano-002',
      paciente_id: 'pac-002',
      titulo: 'Treino de Atenção e Funções Executivas',
      descricao: 'Atividades para melhorar atenção sustentada e memória de trabalho',
      data_inicio: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      data_fim: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ativo',
      criado_em: now(),
      atualizado_em: now(),
    },
  ]

  // Criar métricas demo
  const demoMetricas: MetricaProgresso[] = [
    {
      id: 'met-001',
      paciente_id: 'pac-001',
      categoria: 'Interação Social',
      valor: 65,
      data_registro: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      observacao: 'Escala de 0-100',
      criado_em: now(),
      atualizado_em: now(),
    },
    {
      id: 'met-002',
      paciente_id: 'pac-001',
      categoria: 'Interação Social',
      valor: 75,
      data_registro: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      observacao: 'Progresso consistente',
      criado_em: now(),
      atualizado_em: now(),
    },
  ]

  // Salvar tudo
  setStorage(STORAGE_KEYS.USUARIOS, [demoUsuario])
  setStorage(STORAGE_KEYS.PACIENTES, demoPacientes)
  setStorage(STORAGE_KEYS.SESSOES, demoSessoes)
  setStorage(STORAGE_KEYS.MARCOS, demoMarcos)
  setStorage(STORAGE_KEYS.PLANOS, demoPlanos)
  setStorage(STORAGE_KEYS.METRICAS, demoMetricas)
}

// Inicializar automaticamente
if (typeof window !== 'undefined') {
  initializeDemoData()
}

// ==========================================
// Funções de Autenticação
// ==========================================

export async function mockSignUp(email: string, password: string, nome: string, especialidade?: string) {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 800))

  const usuarios = getStorage<Usuario[]>(STORAGE_KEYS.USUARIOS, [])
  
  // Verificar se email já existe
  const existente = usuarios.find((u) => u.email === email)
  if (existente) {
    return { data: null, error: { message: 'Este email já está cadastrado' } }
  }

  // Validar senha simples (mínimo 6 caracteres para demo)
  if (password.length < 6) {
    return { data: null, error: { message: 'A senha deve ter pelo menos 6 caracteres' } }
  }

  // Criar novo usuário
  const newUsuario: Usuario = {
    id: generateId(),
    email,
    nome,
    especialidade,
    criado_em: now(),
    atualizado_em: now(),
  }

  // Salvar (em produção, senha seria hasheada pelo Supabase)
  setStorage(STORAGE_KEYS.USUARIOS, [...usuarios, newUsuario])

  // Criar sessão
  const session = {
    user: {
      id: newUsuario.id,
      email: newUsuario.email,
      nome: newUsuario.nome,
      especialidade: newUsuario.especialidade,
    },
    created_at: now(),
  }

  setStorage(STORAGE_KEYS.AUTH_USER, newUsuario)
  setStorage(STORAGE_KEYS.AUTH_SESSION, session)

  return { data: { user: session.user, session }, error: null }
}

export async function mockSignIn(email: string, password: string) {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  const usuarios = getStorage<Usuario[]>(STORAGE_KEYS.USUARIOS, [])
  
  // Para demo, aceita qualquer senha com 6+ caracteres
  if (password.length < 6) {
    return { data: null, error: { message: 'Email ou senha incorretos' } }
  }

  // Buscar usuário por email
  const usuario = usuarios.find((u) => u.email === email)
  
  if (!usuario) {
    return { data: null, error: { message: 'Email ou senha incorretos' } }
  }

  // Criar sessão
  const session = {
    user: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      especialidade: usuario.especialidade,
    },
    created_at: now(),
  }

  setStorage(STORAGE_KEYS.AUTH_USER, usuario)
  setStorage(STORAGE_KEYS.AUTH_SESSION, session)

  return { data: { user: session.user, session }, error: null }
}

export async function mockSignOut() {
  setStorage(STORAGE_KEYS.AUTH_USER, null)
  setStorage(STORAGE_KEYS.AUTH_SESSION, null)
  return { error: null }
}

export async function mockGetCurrentUser() {
  return getStorage<AuthUser | null>(STORAGE_KEYS.AUTH_USER, null)
}

export async function mockGetCurrentSession() {
  return getStorage<any>(STORAGE_KEYS.AUTH_SESSION, null)
}

// ==========================================
// Funções CRUD Mock (mesma interface do Supabase)
// ==========================================

// --- PACIENTES ---

export async function mockGetPacientes(usuarioId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  const filtrados = pacientes.filter((p) => p.usuario_id === usuarioId)
  return { data: filtrados, error: null }
}

export async function mockGetPacienteById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  const paciente = pacientes.find((p) => p.id === id)
  return { data: paciente || null, error: null }
}

export async function mockCreatePaciente(paciente: Omit<Paciente, 'id' | 'criado_em' | 'atualizado_em'>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  
  const newPaciente: Paciente = {
    ...paciente,
    id: generateId(),
    criado_em: now(),
    atualizado_em: now(),
  }

  setStorage(STORAGE_KEYS.PACIENTES, [...pacientes, newPaciente])
  return { data: newPaciente, error: null }
}

export async function mockUpdatePaciente(id: string, updates: Partial<Paciente>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  const index = pacientes.findIndex((p) => p.id === id)
  
  if (index === -1) {
    return { data: null, error: { message: 'Paciente não encontrado' } }
  }

  const updated = {
    ...pacientes[index],
    ...updates,
    atualizado_em: now(),
  }

  pacientes[index] = updated
  setStorage(STORAGE_KEYS.PACIENTES, pacientes)
  return { data: updated, error: null }
}

export async function mockDeletePaciente(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  const filtrados = pacientes.filter((p) => p.id !== id)
  setStorage(STORAGE_KEYS.PACIENTES, filtrados)
  return { error: null }
}

// --- SESSÕES ---

export async function mockGetSessoesByPaciente(pacienteId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const sessoes = getStorage<Sessao[]>(STORAGE_KEYS.SESSOES, [])
  const filtradas = sessoes.filter((s) => s.paciente_id === pacienteId)
  return { data: filtradas, error: null }
}

export async function mockCreateSessao(sessao: Omit<Sessao, 'id' | 'criado_em' | 'atualizado_em'>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const sessoes = getStorage<Sessao[]>(STORAGE_KEYS.SESSOES, [])
  
  const newSessao: Sessao = {
    ...sessao,
    id: generateId(),
    criado_em: now(),
    atualizado_em: now(),
  }

  setStorage(STORAGE_KEYS.SESSOES, [...sessoes, newSessao])
  return { data: newSessao, error: null }
}

export async function mockUpdateSessao(id: string, updates: Partial<Sessao>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const sessoes = getStorage<Sessao[]>(STORAGE_KEYS.SESSOES, [])
  const index = sessoes.findIndex((s) => s.id === id)
  
  if (index === -1) {
    return { data: null, error: { message: 'Sessão não encontrada' } }
  }

  const updated = {
    ...sessoes[index],
    ...updates,
    atualizado_em: now(),
  }

  sessoes[index] = updated
  setStorage(STORAGE_KEYS.SESSOES, sessoes)
  return { data: updated, error: null }
}

export async function mockDeleteSessao(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const sessoes = getStorage<Sessao[]>(STORAGE_KEYS.SESSOES, [])
  const filtradas = sessoes.filter((s) => s.id !== id)
  setStorage(STORAGE_KEYS.SESSOES, filtradas)
  return { error: null }
}

// --- MARCOS ---

export async function mockGetMarcosByPaciente(pacienteId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const marcos = getStorage<MarcoDesenvolvimento[]>(STORAGE_KEYS.MARCOS, [])
  const filtrados = marcos.filter((m) => m.paciente_id === pacienteId)
  return { data: filtrados, error: null }
}

export async function mockCreateMarco(marco: Omit<MarcoDesenvolvimento, 'id' | 'criado_em' | 'atualizado_em'>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const marcos = getStorage<MarcoDesenvolvimento[]>(STORAGE_KEYS.MARCOS, [])
  
  const newMarco: MarcoDesenvolvimento = {
    ...marco,
    id: generateId(),
    criado_em: now(),
    atualizado_em: now(),
  }

  setStorage(STORAGE_KEYS.MARCOS, [...marcos, newMarco])
  return { data: newMarco, error: null }
}

export async function mockUpdateMarco(id: string, updates: Partial<MarcoDesenvolvimento>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const marcos = getStorage<MarcoDesenvolvimento[]>(STORAGE_KEYS.MARCOS, [])
  const index = marcos.findIndex((m) => m.id === id)
  
  if (index === -1) {
    return { data: null, error: { message: 'Marco não encontrado' } }
  }

  const updated = {
    ...marcos[index],
    ...updates,
    atualizado_em: now(),
  }

  marcos[index] = updated
  setStorage(STORAGE_KEYS.MARCOS, marcos)
  return { data: updated, error: null }
}

// --- PLANOS ---

export async function mockGetPlanosByPaciente(pacienteId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const planos = getStorage<PlanoTratamento[]>(STORAGE_KEYS.PLANOS, [])
  const filtrados = planos.filter((p) => p.paciente_id === pacienteId)
  return { data: filtrados, error: null }
}

export async function mockCreatePlano(plano: Omit<PlanoTratamento, 'id' | 'criado_em' | 'atualizado_em'>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const planos = getStorage<PlanoTratamento[]>(STORAGE_KEYS.PLANOS, [])
  
  const newPlano: PlanoTratamento = {
    ...plano,
    id: generateId(),
    criado_em: now(),
    atualizado_em: now(),
  }

  setStorage(STORAGE_KEYS.PLANOS, [...planos, newPlano])
  return { data: newPlano, error: null }
}

// --- MÉTRICAS ---

export async function mockGetMetricasByPaciente(pacienteId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const metricas = getStorage<MetricaProgresso[]>(STORAGE_KEYS.METRICAS, [])
  const filtradas = metricas.filter((m) => m.paciente_id === pacienteId)
  return { data: filtradas, error: null }
}

export async function mockCreateMetrica(metrica: Omit<MetricaProgresso, 'id' | 'criado_em' | 'atualizado_em'>) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const metricas = getStorage<MetricaProgresso[]>(STORAGE_KEYS.METRICAS, [])
  
  const newMetrica: MetricaProgresso = {
    ...metrica,
    id: generateId(),
    criado_em: now(),
    atualizado_em: now(),
  }

  setStorage(STORAGE_KEYS.METRICAS, [...metricas, newMetrica])
  return { data: newMetrica, error: null }
}

// --- DASHBOARD STATS ---

export async function mockGetDashboardStats(usuarioId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  const pacientes = getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, [])
  const sessoes = getStorage<Sessao[]>(STORAGE_KEYS.SESSOES, [])
  const marcos = getStorage<MarcoDesenvolvimento[]>(STORAGE_KEYS.MARCOS, [])

  const pacientesDoUsuario = pacientes.filter((p) => p.usuario_id === usuarioId)
  const pacienteIds = pacientesDoUsuario.map((p) => p.id)

  const sessoesDosPacientes = sessoes.filter((s) => pacienteIds.includes(s.paciente_id))
  const marcosDosPacientes = marcos.filter((m) => pacienteIds.includes(m.paciente_id))

  return {
    pacientes: pacientesDoUsuario.length,
    sessoes: sessoesDosPacientes.length,
    marcos: marcosDosPacientes.length,
    marcosAlcancados: marcosDosPacientes.filter((m) => m.status === 'alcancado').length,
  }
}

// ==========================================
// Função para verificar se está em modo demo
// ==========================================

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://seu-projeto.supabase.co'
}

// ==========================================
// Função para resetar dados demo
// ==========================================

export function resetDemoData() {
  if (typeof window === 'undefined') return
  
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
  
  // Reinicializar com dados padrão
  initializeDemoData()
  window.location.reload()
}
