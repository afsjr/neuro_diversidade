"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { getDashboardStats, isSupabaseConfigured } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    pacientes: 0,
    sessoes: 0,
    marcos: 0,
    marcosAlcancados: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && user) {
      loadStats()
    }
  }, [user, authLoading])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se o Supabase está configurado
      if (!isSupabaseConfigured()) {
        setError("Banco de dados não configurado. Verifique as variáveis de ambiente.")
        return
      }

      // Verificar se usuário está autenticado
      if (!user) {
        setError("Usuário não autenticado")
        return
      }

      const usuarioId = user.id
      const data = await getDashboardStats(usuarioId)
      setStats(data)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      setError("Não foi possível carregar as estatísticas do dashboard")
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas do dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Só mostrar skeleton se for o carregamento INICIAL e não tivermos dados
  if (loading && stats.pacientes === 0 && !error) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral dos seus pacientes e atividades</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            <button onClick={loadStats} className="mt-2 text-sm underline hover:no-underline">
              Tentar novamente
            </button>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dados indisponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dados indisponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marcos Definidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dados indisponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marcos Alcançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Dados indisponíveis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral dos seus pacientes e atividades</p>
      </div>

      {!isSupabaseConfigured() && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Modo Demonstração</AlertTitle>
          <AlertDescription>
            O banco de dados não está configurado. Configure as variáveis de ambiente do Supabase para usar dados reais.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pacientes}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pacientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessoes}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total de atendimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcos Definidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marcos}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Objetivos estabelecidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcos Alcançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marcosAlcancados}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.marcos > 0
                ? `${Math.round((stats.marcosAlcancados / stats.marcos) * 100)}% de sucesso`
                : "Nenhum marco definido"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
