"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { testConnection } from "@/lib/supabase"
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react"

export function SupabaseTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
    error?: string
    count?: number
  } | null>(null)

  const handleTestConnection = async () => {
    setIsLoading(true)
    setConnectionStatus(null)

    try {
      const result = await testConnection()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: "Erro inesperado",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Teste de Conexão Supabase</span>
        </CardTitle>
        <CardDescription>Verifique se a conexão com o banco de dados está funcionando corretamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleTestConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testando conexão...
            </>
          ) : (
            "Testar Conexão"
          )}
        </Button>

        {connectionStatus && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {connectionStatus.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <Badge
                variant={connectionStatus.success ? "default" : "destructive"}
                className={connectionStatus.success ? "bg-green-100 text-green-800" : ""}
              >
                {connectionStatus.success ? "Conectado" : "Erro"}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">{connectionStatus.message}</p>

            {connectionStatus.count !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contagem de pacientes: <span className="font-medium">{connectionStatus.count}</span>
              </p>
            )}

            {connectionStatus.error && (
              <p className="text-sm text-red-600 dark:text-red-400">Erro: {connectionStatus.error}</p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Configurada" : "✗ Não configurada"}
          </p>
          <p>
            <strong>Chave:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Configurada" : "✗ Não configurada"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
