'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import {
  signInUser,
  signOutUser,
  signUpUser,
  onAuthStateChange,
  getUsuarioData,
} from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  usuarioData: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, nome: string, especialidade?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshUsuarioData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [usuarioData, setUsuarioData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUsuarioData = useCallback(async () => {
    if (!user) {
      setUsuarioData(null)
      return
    }
    const { data, error } = await getUsuarioData()
    
    // Se o usuário logado não tiver perfil no banco (erro comum após registro inicial)
    if (!data && user) {
      const { data: newData } = await supabase!.from('usuarios').insert([
        {
          id: user.id,
          email: user.email,
          nome: user.user_metadata?.nome || 'Usuário',
          especialidade: user.user_metadata?.especialidade,
        }
      ]).select().single()
      setUsuarioData(newData)
    } else {
      setUsuarioData(data)
    }
  }, [user])

  useEffect(() => {
    // Verificar sessão inicial — chamadas serializadas para evitar race condition
    // nos locks do Supabase Auth (Promise.all causa lock contention)
    const initializeAuth = async () => {
      try {
        // Obter sessão atual primeiro (mais rápido e populado pelo storage)
        const { data: { session: initialSession } } = await supabase!.auth.getSession()
        
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)
          // Tentar carregar dados do usuário
          const { data: dbUserData } = await supabase!.from('usuarios').select('*').eq('id', initialSession.user.id).maybeSingle()
          setUsuarioData(dbUserData)
        } else {
          // Se não tem sessão, tentar getUser por segurança
          const { data: { user: authUser } } = await supabase!.auth.getUser()
          if (authUser) {
            setUser(authUser)
            await refreshUsuarioData()
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Configurar listener de mudanças
    const subscription = onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await refreshUsuarioData()
        // Redirecionar para dashboard após login bem-sucedido, apenas se estiver na raiz ou registro
        if (event === 'SIGNED_IN' && (window.location.pathname === '/' || window.location.pathname === '/registro')) {
          router.push('/dashboard')
        }
      } else {
        setUsuarioData(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUsuarioData])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signInUser(email, password)

      if (error) {
        return { success: false, error: error.message }
      }

      if (data?.user) {
        // Verificar se o perfil existe no banco, se não, criar (reparação automática)
        const { data: profile } = await supabase!.from('usuarios').select('id').eq('id', data.user.id).maybeSingle()
        
        if (!profile) {
          await supabase!.from('usuarios').insert([
            {
              id: data.user.id,
              email: data.user.email,
              nome: data.user.user_metadata?.nome || 'Usuário',
              especialidade: data.user.user_metadata?.especialidade,
            }
          ])
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro inesperado' }
    }
  }

  const signUp = async (email: string, password: string, nome: string, especialidade?: string) => {
    try {
      const { data, error } = await signUpUser(email, password, nome, especialidade)

      if (error) {
        return { success: false, error: error.message }
      }

      if (data?.user) {
        // Criar o perfil na tabela 'usuarios' imediatamente após o registro
        const { error: dbError } = await supabase!
          .from('usuarios')
          .insert([
            {
              id: data.user.id,
              email: email,
              nome: nome,
              especialidade: especialidade,
            }
          ])

        if (dbError) {
          console.error('Erro ao criar perfil no banco:', dbError)
          // Não bloqueamos o sucesso, pois o usuário já foi criado no Auth
        }

        return { success: true }
      }

      return { success: false, error: 'Erro ao registrar usuário' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro inesperado' }
    }
  }

  const signOut = async () => {
    await signOutUser()
    setUser(null)
    setSession(null)
    setUsuarioData(null)
    router.push('/')
  }

  const value = {
    user,
    session,
    usuarioData,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUsuarioData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
