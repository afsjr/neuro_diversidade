import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug de inicialização (ajuda a detectar Failed to Fetch por URL errada)
if (typeof window !== 'undefined') {
  if (!supabaseUrl || supabaseUrl === 'undefined') {
    console.error("ERRO CRÍTICO: NEXT_PUBLIC_SUPABASE_URL não está configurada!");
  }
}

// Criar cliente
export const supabase = (supabaseUrl && supabaseUrl !== 'undefined' && supabaseAnonKey && supabaseAnonKey !== 'undefined') 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }) 
  : null

// Tipos para o banco de dados
export interface Usuario {
  id: string
  email: string
  nome: string
  especialidade?: string
  criado_em: string
  atualizado_em: string
}

export interface Paciente {
  id: string
  nome: string
  data_nascimento: string
  responsavel: string
  telefone?: string
  email?: string
  diagnostico?: string
  status: "ativo" | "inativo" | "alta"
  usuario_id: string
  criado_em: string
  atualizado_em: string
  bio?: string
  formacao?: string
  experiencia?: string
  endereco?: string
  escola?: string
  serie?: string
}

export interface Sessao {
  id: string
  paciente_id: string
  data_sessao: string
  duracao: number
  observacoes?: string
  objetivos?: string
  resultados?: string
  status: "realizada" | "cancelada" | "agendada"
  tipo_profissional?: string
  area_comportamental?: number
  obs_comportamental?: string
  area_emocional?: number
  obs_emocional?: string
  area_motora?: number
  obs_motora?: string
  area_cognitiva?: number
  obs_cognitiva?: string
  area_comunicacao?: number
  obs_comunicacao?: string
  medicacao?: string
  criado_em: string
  atualizado_em: string
}

export interface MarcoDesenvolvimento {
  id: string
  paciente_id: string
  categoria: string
  titulo: string
  descricao?: string
  data_alcancado?: string
  status: "pendente" | "alcancado" | "em_progresso"
  criado_em: string
  atualizado_em: string
}

export interface Conquista {
  id: string
  titulo: string
  descricao: string
  icone: string
  tipo: "paciente" | "profissional"
  categoria: string
  requisito_valor: number
  cor_base: string
  data_conquista?: string
}

export interface PlanoTratamento {
  id: string
  paciente_id: string
  titulo: string
  descricao?: string
  data_inicio: string
  data_fim?: string | null
  status: "ativo" | "concluido" | "pausado"
  criado_em: string
  atualizado_em: string
}

export interface AcompanhamentoPedagogico {
  id: string
  paciente_id: string
  usuario_id: string
  professor_nome: string
  turma: string
  aspectos_positivos: string
  metas_desenvolvimento: string
  observacoes_gerais?: string
  data_registro: string
  criado_em: string
}

export interface MetricaProgresso {
  id: string
  paciente_id: string
  categoria: string
  valor: number
  data_registro: string
  observacao?: string
  criado_em: string
  atualizado_em: string
}

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

// Função de teste de conexão
export async function testConnection() {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Supabase não está configurado. Verifique as variáveis de ambiente.",
      }
    }

    const { count, error } = await supabase!.from("pacientes").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Erro na conexão:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: "Conexão com Supabase estabelecida com sucesso!",
      count,
    }
  } catch (error) {
    console.error("Erro na conexão:", error)
    return { success: false, error: "Erro ao conectar com o banco de dados" }
  }
}

// Funções para Pacientes
export async function getPacientes(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("pacientes")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar pacientes:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar pacientes" } }
  }
}

export async function getPacienteById(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("pacientes").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao buscar paciente" } }
  }
}

export async function createPaciente(paciente: Omit<Paciente, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("pacientes").insert([paciente]).select().single()

    if (error) {
      console.error("Erro ao criar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao criar paciente" } }
  }
}

export async function updatePaciente(id: string, updates: Partial<Paciente>) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!
      .from("pacientes")
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar paciente:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar paciente" } }
  }
}

// Funções para Sessões
export async function getSessoesByPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("sessoes")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_sessao", { ascending: false })

    if (error) {
      console.error("Erro ao buscar sessões:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Erro ao buscar sessões:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar sessões" } }
  }
}

export async function getSessoesByUser(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data: pacientes } = await getPacientes(usuarioId)
    if (!pacientes || pacientes.length === 0) return { data: [], error: null }

    const pacienteIds = pacientes.map(p => p.id)

    const { data, error } = await supabase!
      .from("sessoes")
      .select("*, pacientes(nome)")
      .in("paciente_id", pacienteIds)
      .order("data_sessao", { ascending: false })

    if (error) {
      console.error("Erro ao buscar sessões do usuário:", error)
      return { data: [], error }
    }

    const formatados = (data || []).map(s => ({
      ...s,
      paciente_nome: s.pacientes?.nome || "Paciente não encontrado"
    }))

    return { data: formatados, error: null }
  } catch (error) {
    console.error("Erro ao buscar sessões do usuário:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar sessões" } }
  }
}

export async function createSessao(sessao: Omit<Sessao, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("sessoes").insert([sessao]).select().single()

    if (error) {
      console.error("Erro ao criar sessão:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    return { data: null, error: { message: "Erro inesperado ao criar sessão" } }
  }
}

export async function updateSessao(id: string, updates: Partial<Sessao>) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!
      .from("sessoes")
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar sessão:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar sessão" } }
  }
}

export async function deleteSessao(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { error: { message: "Supabase não configurado" } }
    }

    const { error } = await supabase!.from("sessoes").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar sessão:", error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error("Erro ao deletar sessão:", error)
    return { error: { message: "Erro inesperado ao deletar sessão" } }
  }
}

// Funções para Marcos de Desenvolvimento
export async function getMarcosByPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("marcos_desenvolvimento")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar marcos:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Erro ao buscar marcos:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar marcos" } }
  }
}

export async function getMarcosByUser(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data: pacientes } = await getPacientes(usuarioId)
    if (!pacientes || pacientes.length === 0) return { data: [], error: null }

    const pacienteIds = pacientes.map(p => p.id)

    const { data, error } = await supabase!
      .from("marcos_desenvolvimento")
      .select("*, pacientes(nome)")
      .in("paciente_id", pacienteIds)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar marcos do usuário:", error)
      return { data: [], error }
    }

    const formatados = (data || []).map(m => ({
      ...m,
      paciente_nome: m.pacientes?.nome || "Paciente não encontrado"
    }))

    return { data: formatados, error: null }
  } catch (error) {
    console.error("Erro ao buscar marcos do usuário:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar marcos" } }
  }
}

export async function createMarco(marco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("marcos_desenvolvimento").insert([marco]).select().single()

    if (error) {
      console.error("Erro ao criar marco:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar marco:", error)
    return { data: null, error: { message: "Erro inesperado ao criar marco" } }
  }
}

// Funções para Planos de Tratamento
export async function getPlanosByPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("planos_tratamento")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("criado_em", { ascending: false })

    if (error) {
      console.error("Erro ao buscar planos:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Erro ao buscar planos:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar planos" } }
  }
}

export async function createPlano(plano: Omit<PlanoTratamento, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("planos_tratamento").insert([plano]).select().single()

    if (error) {
      console.error("Erro ao criar plano:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar plano:", error)
    return { data: null, error: { message: "Erro inesperado ao criar plano" } }
  }
}

// Funções para Métricas de Progresso
export async function getMetricasByPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("metricas_progresso")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_registro", { ascending: false })

    if (error) {
      console.error("Erro ao buscar métricas:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Erro ao buscar métricas:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar métricas" } }
  }
}

export async function getMetricasByUser(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data: pacientes } = await getPacientes(usuarioId)
    if (!pacientes || pacientes.length === 0) return { data: [], error: null }

    const pacienteIds = pacientes.map(p => p.id)

    const { data, error } = await supabase!
      .from("metricas_progresso")
      .select("*, pacientes(nome)")
      .in("paciente_id", pacienteIds)
      .order("data_registro", { ascending: false })

    if (error) {
      console.error("Erro ao buscar métricas do usuário:", error)
      return { data: [], error }
    }

    const formatados = (data || []).map(m => ({
      ...m,
      paciente_nome: m.pacientes?.nome || "Paciente não encontrado"
    }))

    return { data: formatados, error: null }
  } catch (error) {
    console.error("Erro ao buscar métricas do usuário:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar métricas" } }
  }
}

export async function createMetrica(metrica: Omit<MetricaProgresso, "id" | "criado_em" | "atualizado_em">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("metricas_progresso").insert([metrica]).select().single()

    if (error) {
      console.error("Erro ao criar métrica:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar métrica:", error)
    return { data: null, error: { message: "Erro inesperado ao criar métrica" } }
  }
}

// Funções de estatísticas
export async function getDashboardStats(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { pacientes: 0, sessoes: 0, marcos: 0, marcosAlcancados: 0 }
    }

    const { data: pacientes } = await supabase!
      .from("pacientes")
      .select("id")
      .eq("usuario_id", usuarioId)

    const pacienteIds = pacientes?.map((p) => p.id) || []

    if (pacienteIds.length === 0) {
      return { pacientes: 0, sessoes: 0, marcos: 0, marcosAlcancados: 0 }
    }

    const [sessoesCount, marcosCount, alcancadosCount] = await Promise.all([
      supabase!.from("sessoes").select("id", { count: "exact", head: true }).in("paciente_id", pacienteIds),
      supabase!
        .from("marcos_desenvolvimento")
        .select("id", { count: "exact", head: true })
        .in("paciente_id", pacienteIds),
      supabase!
        .from("marcos_desenvolvimento")
        .select("id", { count: "exact", head: true })
        .in("paciente_id", pacienteIds)
        .eq("status", "alcancado"),
    ])

    return {
      pacientes: pacienteIds.length,
      sessoes: sessoesCount.count || 0,
      marcos: marcosCount.count || 0,
      marcosAlcancados: alcancadosCount.count || 0,
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas dashboard:", error)
    return { pacientes: 0, sessoes: 0, marcos: 0, marcosAlcancados: 0 }
  }
}

export async function getPacienteStats(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { sessoes: 0, marcos: 0, marcosAlcancados: 0, metricas: [] }
    }

    const [sessoesCount, marcosCount, alcancadosCount, metricasRes] = await Promise.all([
      supabase!.from("sessoes").select("id", { count: "exact", head: true }).eq("paciente_id", pacienteId),
      supabase!
        .from("marcos_desenvolvimento")
        .select("id", { count: "exact", head: true })
        .eq("paciente_id", pacienteId),
      supabase!
        .from("marcos_desenvolvimento")
        .select("id", { count: "exact", head: true })
        .eq("paciente_id", pacienteId)
        .eq("status", "alcancado"),
      supabase!
        .from("metricas_progresso")
        .select("*")
        .eq("paciente_id", pacienteId)
        .order("data_registro", { ascending: false })
    ])

    return {
      sessoes: sessoesCount.count || 0,
      marcos: marcosCount.count || 0,
      marcosAlcancados: alcancadosCount.count || 0,
      metricas: metricasRes.data || []
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas do paciente:", error)
    return { sessoes: 0, marcos: 0, marcosAlcancados: 0, metricas: [] }
  }
}

export interface Agendamento {
  id: string
  paciente_id: string
  paciente_nome?: string
  data: string
  hora: string
  duracao: number
  tipo: "consulta" | "sessao" | "avaliacao"
  status: "agendado" | "confirmado" | "realizado" | "cancelado"
  observacoes?: string
  usuario_id: string
  criado_em: string
}

// Funções para Agendamentos
export async function getAgendamentos(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from("agendamentos")
      .select("*, pacientes(nome)")
      .eq("usuario_id", usuarioId)
      .order("data", { ascending: true })

    if (error) {
      console.error("Erro ao buscar agendamentos:", error)
      return { data: [], error }
    }

    // Mapear o nome do paciente vindo do join
    const formatados = (data || []).map(a => ({
      ...a,
      paciente_nome: a.pacientes?.nome || "Paciente não encontrado"
    }))

    return { data: formatados, error: null }
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return { data: [], error: { message: "Erro inesperado ao buscar agendamentos" } }
  }
}

export async function createAgendamento(agendamento: Omit<Agendamento, "id" | "criado_em" | "paciente_nome">) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!.from("agendamentos").insert([agendamento]).select().single()

    if (error) {
      console.error("Erro ao criar agendamento:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return { data: null, error: { message: "Erro inesperado ao criar agendamento" } }
  }
}

export async function updateAgendamento(id: string, updates: Partial<Agendamento>) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!
      .from("agendamentos")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar agendamento:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar agendamento" } }
  }
}

export async function deleteAgendamento(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { error: { message: "Supabase não configurado" } }
    }

    const { error } = await supabase!.from("agendamentos").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar agendamento:", error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error)
    return { error: { message: "Erro inesperado ao deletar agendamento" } }
  }
}

export interface Documento {
  id: string
  paciente_id: string
  nome: string
  url: string
  tipo: string
  tamanho: number
  criado_em: string
  usuario_id: string
}

// Funções para Documentos (Storage + Database)
export async function uploadDocumento(
  pacienteId: string, 
  usuarioId: string, 
  file: File
) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${pacienteId}/${fileName}`

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase!.storage
      .from('documentos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Pegar URL pública
    const { data: { publicUrl } } = supabase!.storage
      .from('documentos')
      .getPublicUrl(filePath)

    // 3. Salvar registro na tabela 'documentos'
    const { data, error: dbError } = await supabase!
      .from('documentos')
      .insert([{
        paciente_id: pacienteId,
        usuario_id: usuarioId,
        nome: file.name,
        url: publicUrl,
        tipo: file.type,
        tamanho: file.size
      }])
      .select()
      .single()

    if (dbError) throw dbError

    return { data, error: null }
  } catch (error: any) {
    console.error("Erro no upload de documento:", error)
    return { data: null, error }
  }
}

export async function getDocumentosByPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null }
    }

    const { data, error } = await supabase!
      .from('documentos')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('criado_em', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Erro ao buscar documentos:", error)
    return { data: [], error }
  }
}

export async function deleteDocumento(documentoId: string, url: string) {
  try {
    // 1. Deletar do banco
    const { error: dbError } = await supabase!
      .from('documentos')
      .delete()
      .eq('id', documentoId)

    if (dbError) throw dbError

    // Nota: A limpeza do storage pode ser feita via Trigger ou manualmente
    // Para simplificar agora, focamos no banco.
    
    return { error: null }
  } catch (error: any) {
    console.error("Erro ao deletar documento:", error)
    return { error }
  }
}

// Funções para Usuários
export async function updateUsuario(id: string, updates: Partial<Usuario>) {
  try {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: "Supabase não configurado" } }
    }

    const { data, error } = await supabase!
      .from("usuarios")
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar usuário:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error)
    return { data: null, error: { message: "Erro inesperado ao atualizar usuário" } }
  }
}

// Funções de Gamificação
export async function getConquistasUsuario(usuarioId: string) {
  try {
    if (!isSupabaseConfigured()) return { data: [], error: null }

    const { data, error } = await supabase!
      .from("conquistas_alcancadas")
      .select("*, conquistas_definicao(*)")
      .eq("usuario_id", usuarioId)

    if (error) throw error

    return { 
      data: data.map(a => ({
        ...a.conquistas_definicao,
        data_conquista: a.data_conquista
      })) as Conquista[], 
      error: null 
    }
  } catch (error) {
    console.error("Erro ao buscar conquistas do usuário:", error)
    return { data: [], error }
  }
}

export async function getConquistasPaciente(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) return { data: [], error: null }

    const { data, error } = await supabase!
      .from("conquistas_alcancadas")
      .select("*, conquistas_definicao(*)")
      .eq("paciente_id", pacienteId)

    if (error) throw error

    return { 
      data: data.map(a => ({
        ...a.conquistas_definicao,
        data_conquista: a.data_conquista
      })) as Conquista[], 
      error: null 
    }
  } catch (error) {
    console.error("Erro ao buscar conquistas do paciente:", error)
    return { data: [], error }
  }
}

/**
 * Checks and awards achievements based on current stats.
 */
export async function checkAndAwardConquistas(targetId: string, tipo: "paciente" | "profissional") {
  try {
    if (!isSupabaseConfigured()) return

    // 1. Obter definições de conquistas para o tipo
    const { data: definicoes } = await supabase!
      .from("conquistas_definicao")
      .select("*")
      .eq("tipo", tipo)

    if (!definicoes) return

    // 2. Obter estatísticas atuais
    let statsValue = { sessoes: 0, marcos: 0, documentacao: 0 }

    if (tipo === "paciente") {
      const [sessoes, marcos] = await Promise.all([
        supabase!.from("sessoes").select("id", { count: "exact", head: true }).eq("paciente_id", targetId),
        supabase!.from("marcos_desenvolvimento").select("id", { count: "exact", head: true }).eq("paciente_id", targetId).eq("status", "alcancado")
      ])
      statsValue = { sessoes: sessoes.count || 0, marcos: marcos.count || 0, documentacao: 0 }
    } else {
      const stats = await getDashboardStats(targetId)
      statsValue = { sessoes: stats.sessoes, marcos: stats.marcosAlcancados, documentacao: 0 }
    }

    // 3. Verificar cada definição
    for (const def of definicoes) {
      let atingiu = false
      if (def.categoria === "sessoes" && statsValue.sessoes >= def.requisito_valor) atingiu = true
      if (def.categoria === "marcos" && statsValue.marcos >= def.requisito_valor) atingiu = true

      if (atingiu) {
        // Tentar inserir (o UNIQUE no banco evita duplicatas)
        await supabase!
          .from("conquistas_alcancadas")
          .insert([{
            conquista_id: def.id,
            [tipo === "paciente" ? "paciente_id" : "usuario_id"]: targetId
          }])
          .select() // Força execução
      }
    }
  } catch (err) {
    console.error("Erro ao processar conquistas:", err)
  }
}

// Funções Módulo Pedagógico
export async function getAcompanhamentoPedagogico(pacienteId: string) {
  try {
    if (!isSupabaseConfigured()) return { data: [], error: null }

    const { data, error } = await supabase!
      .from("acompanhamento_pedagogico")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_registro", { ascending: false })

    if (error) throw error
    return { data: data as AcompanhamentoPedagogico[], error: null }
  } catch (error) {
    console.error("Erro ao buscar registros pedagógicos:", error)
    return { data: [], error }
  }
}

export async function createAcompanhamentoPedagogico(registro: Omit<AcompanhamentoPedagogico, "id" | "criado_em" | "usuario_id">) {
  try {
    const { data: userData } = await supabase!.auth.getUser()
    if (!userData.user) throw new Error("Usuário não autenticado")

    const { data, error } = await supabase!
      .from("acompanhamento_pedagogico")
      .insert([{
        ...registro,
        usuario_id: userData.user.id
      }])
      .select()
      .single()

    if (error) throw error
    return { data: data as AcompanhamentoPedagogico, error: null }
  } catch (error) {
    console.error("Erro ao criar registro pedagógico:", error)
    return { data: null, error }
  }
}

export async function deleteAcompanhamentoPedagogico(id: string) {
  try {
    const { error } = await supabase!
      .from("acompanhamento_pedagogico")
      .delete()
      .eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Erro ao excluir registro pedagógico:", error)
    return { error }
  }
}
