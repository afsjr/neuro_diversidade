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
    const { data } = await getUsuarioData()
    setUsuarioData(data)
  }, [user])

  useEffect(() => {
    // Verificar sessão inicial — chamadas serializadas para evitar race condition
    // nos locks do Supabase Auth (Promise.all causa lock contention)
    const initializeAuth = async () => {
      try {
        // Usar apenas getUser() que já retorna session + user
        const { data, error } = await supabase!.auth.getUser()

        if (error) {
          // Sessão inválida/expirada — ignorar silenciosamente
          setUser(null)
          setSession(null)
        } else if (data?.user) {
          setUser(data.user)
          setSession(data.session)
          await refreshUsuarioData()
        } else {
          setUser(null)
          setSession(null)
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Configurar listener de mudanças
    const subscription = onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await refreshUsuarioData()
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
        router.push('/dashboard')
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
        router.push('/dashboard')
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
