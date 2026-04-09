"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Award, Target, Users } from "lucide-react"

interface AnaliseGeralProps {
  periodo: string
}

export function AnaliseGeral({ periodo }: AnaliseGeralProps) {
  const dadosGerais = {
    totalPacientes: 6,
    pacientesComMelhoria: 5,
    marcosAlcancados: 15,
    marcosPendentes: 8,
    taxaMelhoria: 87,
    categorias: [
      { nome: "Comunicação", progresso: 85, tendencia: "up", mudanca: 12 },
      { nome: "Social", progresso: 78, tendencia: "up", mudanca: 8 },
      { nome: "Motor", progresso: 92, tendencia: "up", mudanca: 15 },
      { nome: "Cognitivo", progresso: 73, tendencia: "down", mudanca: -3 },
      { nome: "Comportamental", progresso: 81, tendencia: "up", mudanca: 7 },
    ],
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
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

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
          <CardDescription>Visão geral do desempenho no período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{dadosGerais.totalPacientes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Ativos</div>
              <div className="text-xs text-green-600 mt-1">{dadosGerais.pacientesComMelhoria} com melhoria</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">{dadosGerais.marcosAlcancados}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Marcos Alcançados</div>
              <div className="text-xs text-yellow-600 mt-1">{dadosGerais.marcosPendentes} pendentes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">{dadosGerais.taxaMelhoria}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Melhoria</div>
              <div className="text-xs text-green-600 mt-1">+12% vs período anterior</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Categoria</CardTitle>
          <CardDescription>Desempenho médio em cada área de desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dadosGerais.categorias.map((categoria) => (
              <div key={categoria.nome} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{categoria.nome}</span>
                    {getTendenciaIcon(categoria.tendencia)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{categoria.progresso}%</span>
                    <span className={`text-xs ${getTendenciaColor(categoria.tendencia)}`}>
                      {categoria.mudanca > 0 ? "+" : ""}
                      {categoria.mudanca}%
                    </span>
                  </div>
                </div>
                <Progress value={categoria.progresso} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
          <CardDescription>Análises baseadas nos dados coletados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Excelente Progresso Motor</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    A categoria Motor apresentou o melhor desempenho com 92% de progresso e +15% de melhoria. Continue
                    focando nas atividades de coordenação motora.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-2">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Atenção à Área Cognitiva</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    A categoria Cognitiva apresentou uma pequena queda de -3%. Considere revisar as estratégias de
                    intervenção nesta área.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Meta de Marcos Alcançada</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    15 marcos foram alcançados neste período, superando a meta de 12 marcos. Parabéns pelo excelente
                    trabalho!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
