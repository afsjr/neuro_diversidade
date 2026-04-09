"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, User } from "lucide-react"

interface AnalisePacienteProps {
  periodo: string
}

const pacientesData = [
  {
    id: "1",
    nome: "Ana Silva",
    idade: 9,
    diagnostico: "TEA",
    sessoes: 8,
    marcosAlcancados: 5,
    progresso: {
      comunicacao: { atual: 7, anterior: 5, tendencia: "up" },
      social: { atual: 6, anterior: 4, tendencia: "up" },
      motor: { atual: 8, anterior: 7, tendencia: "up" },
      cognitivo: { atual: 6, anterior: 6, tendencia: "stable" },
      comportamental: { atual: 7, anterior: 6, tendencia: "up" },
    },
  },
  {
    id: "2",
    nome: "João Santos",
    idade: 12,
    diagnostico: "TDAH",
    sessoes: 6,
    marcosAlcancados: 3,
    progresso: {
      comunicacao: { atual: 8, anterior: 7, tendencia: "up" },
      social: { atual: 7, anterior: 6, tendencia: "up" },
      motor: { atual: 9, anterior: 8, tendencia: "up" },
      cognitivo: { atual: 6, anterior: 7, tendencia: "down" },
      comportamental: { atual: 8, anterior: 7, tendencia: "up" },
    },
  },
]

export function AnalisePaciente({ periodo }: AnalisePacienteProps) {
  const [pacienteSelecionado, setPacienteSelecionado] = useState("1")

  const paciente = pacientesData.find((p) => p.id === pacienteSelecionado)

  if (!paciente) return null

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const progressoMedio =
    Object.values(paciente.progresso).reduce((acc, p) => acc + p.atual, 0) / Object.values(paciente.progresso).length

  return (
    <div className="space-y-6">
      {/* Seletor de Paciente */}
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
              {pacientesData.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nome} - {p.diagnostico}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Informações do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{paciente.nome}</span>
          </CardTitle>
          <CardDescription>Análise detalhada do progresso individual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{paciente.idade}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Anos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{paciente.sessoes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessões</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{paciente.marcosAlcancados}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Marcos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{progressoMedio.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Progresso Médio</div>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="secondary">{paciente.diagnostico}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progresso Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Categoria</CardTitle>
          <CardDescription>Evolução detalhada em cada área de desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(paciente.progresso).map(([categoria, dados]) => (
              <div key={categoria} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">{categoria}</span>
                    {getTendenciaIcon(dados.tendencia)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{dados.atual}/10</span>
                    <span className={`text-xs ${getTendenciaColor(dados.tendencia)}`}>
                      {dados.atual > dados.anterior ? "+" : dados.atual < dados.anterior ? "" : ""}
                      {dados.atual - dados.anterior !== 0 ? dados.atual - dados.anterior : "="}
                    </span>
                  </div>
                </div>
                <Progress value={(dados.atual / 10) * 100} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Anterior: {dados.anterior}/10</span>
                  <span>Atual: {dados.atual}/10</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações Específicas */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Personalizadas</CardTitle>
          <CardDescription>Sugestões baseadas no progresso do paciente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(paciente.progresso)
              .map(([categoria, dados]) => {
                if (dados.tendencia === "down") {
                  return (
                    <div
                      key={categoria}
                      className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-start space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200 capitalize">
                            Atenção: {categoria}
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Esta área apresentou declínio. Considere revisar as estratégias de intervenção e aumentar o
                            foco nas atividades relacionadas.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }

                if (dados.tendencia === "up" && dados.atual >= 8) {
                  return (
                    <div
                      key={categoria}
                      className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200 capitalize">
                            Excelente: {categoria}
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Ótimo progresso nesta área! Continue com as estratégias atuais e considere aumentar a
                            complexidade dos exercícios.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }

                return null
              })
              .filter(Boolean)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
