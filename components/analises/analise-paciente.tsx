"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, User, Loader2 } from "lucide-react"

import { getPacienteStats, type Paciente } from "@/lib/supabase"
import { calculateAge } from "@/lib/utils"

interface AnalisePacienteProps {
  periodo: string
  pacientesIniciais: Paciente[]
}

export function AnalisePaciente({ periodo, pacientesIniciais }: AnalisePacienteProps) {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(pacientesIniciais[0]?.id || "")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    sessoes: 0,
    marcos: 0,
    marcosAlcancados: 0,
    metricas: [] as any[]
  })

  const loadPacienteData = useCallback(async (id: string) => {
    if (!id) return
    setLoading(true)
    try {
      const data = await getPacienteStats(id)
      setStats(data)
    } catch (err) {
      console.error("Erro ao carregar dados do paciente:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (pacienteSelecionado) {
      loadPacienteData(pacienteSelecionado)
    }
  }, [pacienteSelecionado, loadPacienteData])

  const pacienteReal = pacientesIniciais.find((p) => p.id === pacienteSelecionado)

  if (pacientesIniciais.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Nenhum paciente cadastrado para análise.
        </CardContent>
      </Card>
    )
  }

  // Agrupar métricas por categoria para exibir progresso
  const metricasPorCategoria = stats.metricas.reduce((acc: any, curr) => {
    if (!acc[curr.categoria]) {
      acc[curr.categoria] = {
        atual: curr.valor,
        anterior: curr.valor, // Provisório se houver apenas um registro
        registros: [curr.valor]
      }
    } else {
      acc[curr.categoria].registros.push(curr.valor)
      // O primeiro do array (mais recente por causa do order descript) é o atual
      // O segundo mais recente é o "anterior" para tendência
      if (acc[curr.categoria].registros.length > 1) {
        acc[curr.categoria].anterior = acc[curr.categoria].registros[1]
      }
    }
    return acc
  }, {})

  const getTendenciaIcon = (atual: number, anterior: number) => {
    if (atual > anterior) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (atual < anterior) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const getTendenciaColor = (atual: number, anterior: number) => {
    if (atual > anterior) return "text-green-600"
    if (atual < anterior) return "text-red-600"
    return "text-gray-600"
  }

  const progressoMedio = stats.metricas.length > 0 
    ? stats.metricas.reduce((acc, m) => acc + Number(m.valor), 0) / stats.metricas.length 
    : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Paciente</CardTitle>
          <CardDescription>Escolha o paciente para análise detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={pacienteSelecionado} onValueChange={setPacienteSelecionado}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pacientesIniciais.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome} - {p.diagnostico || "Sem diagnóstico"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{pacienteReal?.nome}</span>
              </CardTitle>
              <CardDescription>Análise detalhada do progresso individual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {pacienteReal?.data_nascimento ? calculateAge(pacienteReal.data_nascimento) : "--"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Anos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.sessoes}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessões</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.marcosAlcancados}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Marcos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{progressoMedio.toFixed(1)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progresso Médio</div>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">{pacienteReal?.diagnostico || "Sem diagnóstico"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso por Categoria</CardTitle>
              <CardDescription>Baseado nas métricas de progresso registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(metricasPorCategoria).length > 0 ? (
                  Object.entries(metricasPorCategoria).map(([categoria, dados]: [string, any]) => (
                    <div key={categoria} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium capitalize">{categoria}</span>
                          {getTendenciaIcon(dados.atual, dados.anterior)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{dados.atual}/10</span>
                          <span className={`text-xs ${getTendenciaColor(dados.atual, dados.anterior)}`}>
                            {dados.atual > dados.anterior ? "+" : ""}{dados.atual - dados.anterior !== 0 ? (dados.atual - dados.anterior).toFixed(1) : "="}
                          </span>
                        </div>
                      </div>
                      <Progress value={(dados.atual / 10) * 100} className="h-3" />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhuma métrica registrada para este paciente.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
