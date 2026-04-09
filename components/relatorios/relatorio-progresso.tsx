"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react"

interface ProgressoData {
  paciente: string
  categoria: string
  mes: string
  valor: number
}

const progressoExemplo: ProgressoData[] = [
  { paciente: "Ana Silva", categoria: "Comunicação", mes: "2024-01", valor: 3 },
  { paciente: "Ana Silva", categoria: "Comunicação", mes: "2024-02", valor: 5 },
  { paciente: "Ana Silva", categoria: "Social", mes: "2024-01", valor: 2 },
  { paciente: "Ana Silva", categoria: "Social", mes: "2024-02", valor: 4 },
  { paciente: "João Santos", categoria: "Atenção", mes: "2024-01", valor: 4 },
  { paciente: "João Santos", categoria: "Atenção", mes: "2024-02", valor: 6 },
]

export function RelatorioProgresso() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState("Ana Silva")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Comunicação")

  const pacientes = Array.from(new Set(progressoExemplo.map((p) => p.paciente)))
  const categorias = Array.from(new Set(progressoExemplo.map((p) => p.categoria)))

  const dadosFiltrados = progressoExemplo.filter(
    (p) => p.paciente === pacienteSelecionado && p.categoria === categoriaSelecionada,
  )

  const progressoAtual = dadosFiltrados.length > 0 ? dadosFiltrados[dadosFiltrados.length - 1].valor : 0
  const progressoAnterior = dadosFiltrados.length > 1 ? dadosFiltrados[dadosFiltrados.length - 2].valor : 0
  const melhoria = progressoAtual - progressoAnterior

  const estatisticasGerais = {
    totalMarcosAlcancados: 12,
    marcosEmProgresso: 8,
    marcosPendentes: 5,
    taxaSucesso: 75,
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
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

      {/* Estatísticas Gerais */}
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

      {/* Gráfico de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Progresso</CardTitle>
          <CardDescription>
            {pacienteSelecionado} - {categoriaSelecionada}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{progressoAtual}/10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Nível Atual</div>
              </div>
              <div className={`flex items-center space-x-1 ${melhoria >= 0 ? "text-green-600" : "text-red-600"}`}>
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">
                  {melhoria >= 0 ? "+" : ""}
                  {melhoria} pontos
                </span>
              </div>
            </div>

            {/* Gráfico de barras simples */}
            <div className="space-y-3">
              {dadosFiltrados.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.mes}</span>
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
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Marcos por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => {
              const dadosCategoria = progressoExemplo.filter((p) => p.categoria === categoria)
              const mediaProgresso =
                dadosCategoria.length > 0
                  ? dadosCategoria.reduce((acc, p) => acc + p.valor, 0) / dadosCategoria.length
                  : 0

              return (
                <Card key={categoria}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{categoria}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{mediaProgresso.toFixed(1)}/10</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Média Geral</div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(mediaProgresso / 10) * 100}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
