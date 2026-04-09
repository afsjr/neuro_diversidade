import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// Funções de Autenticação
export async function signUpUser(email: string, password: string, nome: string, especialidade?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          especialidade,
        },
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return { data: null, error }
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { data: null, error }
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return { error }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Erro ao obter sessão atual:', error)
    return null
  }
}

// Listener de mudanças de autenticação
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

// Função para verificar se usuário está autenticado
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Função para obter dados do usuário da tabela usuarios
export async function getUsuarioData() {
  try {
    const user = await getCurrentUser()
    if (!user) return { data: null, error: { message: 'Usuário não autenticado' } }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Erro ao obter dados do usuário:', error)
      return { data: null, error }
    }

    // Retorna null se não encontrou (sem throw)
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    return { data: null, error }
  }
}

// Função para atualizar dados do usuário
export async function updateUsuarioData(updates: { nome?: string; especialidade?: string; telefone?: string; avatar_url?: string }) {
  try {
    const user = await getCurrentUser()
    if (!user) return { data: null, error: { message: 'Usuário não autenticado' } }

    const { data, error } = await supabase
      .from('usuarios')
      .update({ ...updates, atualizado_em: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error)
    return { data: null, error }
  }
}

// Função para atualizar perfil do usuário (auth metadata)
export async function updateAuthProfile(nome?: string, especialidade?: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: { nome, especialidade },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return { data: null, error }
  }
}
