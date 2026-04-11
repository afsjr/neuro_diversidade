"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, Award, BarChart3, Loader2 } from "lucide-react"
import { getMetricasByUser, getMarcosByUser, getPacientes } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface ProgressoData {
  paciente_nome: string
  categoria: string
  data_registro: string
  valor: number
}

interface MarcoData {
  status: string
}

export function RelatorioProgresso() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [metricas, setMetricas] = useState<ProgressoData[]>([])
  const [marcos, setMarcos] = useState<MarcoData[]>([])
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string>("todos")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("todos")

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const [metricasRes, marcosRes] = await Promise.all([
        getMetricasByUser(user.id),
        getMarcosByUser(user.id)
      ])
      
      setMetricas(metricasRes.data || [])
      setMarcos(marcosRes.data || [])
      
    } catch (err) {
      console.error("Erro ao carregar dados de progresso:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const pacientes = Array.from(new Set(metricas.map((p) => p.paciente_nome)))
  const categorias = Array.from(new Set(metricas.map((p) => p.categoria)))

  const dadosFiltrados = metricas.filter((p) => {
    const matchPaciente = pacienteSelecionado === "todos" || p.paciente_nome === pacienteSelecionado
    const matchCategoria = categoriaSelecionada === "todos" || p.categoria === categoriaSelecionada
    return matchPaciente && matchCategoria
  })

  const progressoAtual = dadosFiltrados.length > 0 ? dadosFiltrados[0].valor : 0
  const progressoAnterior = dadosFiltrados.length > 1 ? dadosFiltrados[1].valor : 0
  const melhoria = (progressoAtual || 0) - (progressoAnterior || 0)

  const estatisticasGerais = {
    totalMarcosAlcancados: marcos.filter(m => m.status === "alcancado").length,
    marcosEmProgresso: marcos.filter(m => m.status === "em_progresso").length,
    marcosPendentes: marcos.filter(m => m.status === "pendente").length,
    taxaSucesso: marcos.length > 0 ? Math.round((marcos.filter(m => m.status === "alcancado").length / marcos.length) * 100) : 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Progresso</CardTitle>
          <CardDescription>Selecione o paciente e categoria para visualizar o progresso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Paciente</label>
              <Select value={pacienteSelecionado} onValueChange={setPacienteSelecionado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Pacientes</SelectItem>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente} value={paciente}>
                      {paciente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{estatisticasGerais.totalMarcosAlcancados}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Marcos Alcançados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{estatisticasGerais.marcosEmProgresso}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Em Progresso</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{estatisticasGerais.marcosPendentes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{estatisticasGerais.taxaSucesso}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Sucesso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Progresso</CardTitle>
          <CardDescription>
            {pacienteSelecionado === "todos" ? "Todos os Pacientes" : pacienteSelecionado} - {categoriaSelecionada === "todos" ? "Todas as Categorias" : categoriaSelecionada}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dadosFiltrados.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{progressoAtual}/10</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Último Registro</div>
                  </div>
                  <div className={`flex items-center space-x-1 ${melhoria >= 0 ? "text-green-600" : "text-red-600"}`}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">
                      {melhoria >= 0 ? "+" : ""}
                      {melhoria} pontos
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {dadosFiltrados.slice(0, 5).map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{new Date(item.data_registro).toLocaleDateString("pt-BR")} - {item.paciente_nome}</span>
                        <span>{item.valor}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(item.valor / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhum dado de métrica encontrado para os filtros selecionados.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
