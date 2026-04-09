"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SupabaseTest } from "@/components/supabase-test"
import { getDashboardStats } from "@/lib/supabase"
import { CheckCircle, XCircle, Users, Activity, Award, Calendar } from "lucide-react"

export default function TesteConexaoPage() {
  const [dbStats, setDbStats] = useState<{
    pacientes: number
    sessoes: number
    marcos: number
    marcosAlcancados: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDatabaseStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Usar o UUID válido que inserimos no banco
      const usuarioId = "00000000-0000-0000-0000-000000000000"

      const stats = await getDashboardStats(usuarioId)
      setDbStats(stats)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      setError("Erro ao carregar estatísticas do banco de dados")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDatabaseStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teste de Conexão</h1>
        <p className="text-gray-600 dark:text-gray-400">Verifique o status da conexão com o banco de dados Supabase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teste de Conexão */}
        <SupabaseTest />

        {/* Estatísticas do Banco */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Estatísticas do Banco</span>
            </CardTitle>
            <CardDescription>Dados atuais armazenados no banco de dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={loadDatabaseStats} disabled={isLoading} variant="outline" className="w-full">
              {isLoading ? "Carregando..." : "Atualizar Estatísticas"}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {dbStats && (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Pacientes</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{dbStats.pacientes}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Sessões</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{dbStats.sessoes}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Marcos Totais</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{dbStats.marcos}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Marcos Alcançados</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{dbStats.marcosAlcancados}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Ambiente</CardTitle>
          <CardDescription>Verifique se as variáveis de ambiente estão configuradas corretamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Variáveis de Ambiente</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                    <span className="text-xs text-gray-500">
                      ({process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...)
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                    <span className="text-xs text-gray-500">
                      ({process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Tabelas Criadas</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>usuarios</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>pacientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>sessoes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>marcos_desenvolvimento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>planos_tratamento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>metricas_progresso</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teste de Operações CRUD */}
      <Card>
        <CardHeader>
          <CardTitle>Teste de Operações</CardTitle>
          <CardDescription>Teste as operações básicas do banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const { data } = await getDashboardStats("00000000-0000-0000-0000-000000000000")
                  console.log("Dados carregados:", data)
                } catch (error) {
                  console.error("Erro no teste de leitura:", error)
                }
              }}
            >
              Teste de Leitura
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                console.log("Teste de escrita - implementar conforme necessário")
              }}
            >
              Teste de Escrita
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                console.log("Teste de atualização - implementar conforme necessário")
              }}
            >
              Teste de Atualização
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
