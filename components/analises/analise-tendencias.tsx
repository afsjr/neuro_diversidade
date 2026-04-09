"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, Target } from "lucide-react"

interface AnaliseTendenciasProps {
  periodo: string
}

const tendenciasData = {
  geral: {
    crescimento: 15,
    previsao: 22,
    tendencia: "up",
  },
  categorias: [
    {
      nome: "Comunicação",
      historico: [65, 68, 72, 75, 78],
      previsao: 82,
      tendencia: "up",
      velocidade: "moderada",
    },
    {
      nome: "Social",
      historico: [58, 60, 62, 64, 62],
      previsao: 64,
      tendencia: "stable",
      velocidade: "lenta",
    },
    {
      nome: "Motor",
      historico: [75, 78, 82, 85, 88],
      previsao: 92,
      tendencia: "up",
      velocidade: "rápida",
    },
  ],
  marcos: {
    alcancadosMes: [2, 3, 4, 5, 4],
    previsaoProximo: 6,
    tendencia: "up",
  },
}

export function AnaliseTendencias({ periodo }: AnaliseTendenciasProps) {
  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  const getVelocidadeColor = (velocidade: string) => {
    switch (velocidade) {
      case "rápida":
        return "text-green-600"
      case "moderada":
        return "text-yellow-600"
      case "lenta":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai"]

  return (
    <div className="space-y-6">
      {/* Tendência Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Tendência Geral</span>
          </CardTitle>
          <CardDescription>Análise de tendências e projeções futuras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+{tendenciasData.geral.crescimento}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Crescimento Atual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{tendenciasData.geral.previsao}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Previsão Próximo Mês</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getTendenciaIcon(tendenciasData.geral.tendencia)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tendência Positiva</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tendências por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Tendências por Categoria</CardTitle>
          <CardDescription>Evolução histórica e projeções por área</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tendenciasData.categorias.map((categoria) => (
              <div key={categoria.nome} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{categoria.nome}</span>
                    {getTendenciaIcon(categoria.tendencia)}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">
                      Velocidade:{" "}
                      <span className={getVelocidadeColor(categoria.velocidade)}>{categoria.velocidade}</span>
                    </span>
                    <span className="text-sm font-medium">Previsão: {categoria.previsao}%</span>
                  </div>
                </div>

                {/* Gráfico de linha simples */}
                <div className="relative">
                  <div className="flex items-end justify-between h-20 border-b border-l border-gray-300 dark:border-gray-600">
                    {categoria.historico.map((valor, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-blue-500 rounded-t transition-all duration-300"
                          style={{ height: `${(valor / 100) * 80}px`, minHeight: "4px" }}
                        ></div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{meses[index]}</div>
                      </div>
                    ))}
                    {/* Previsão */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 bg-green-500 rounded-t transition-all duration-300 opacity-70"
                        style={{ height: `${(categoria.previsao / 100) * 80}px`, minHeight: "4px" }}
                      ></div>
                      <div className="mt-1 text-xs text-green-600">Prev</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Marcos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Tendência de Marcos Alcançados</span>
          </CardTitle>
          <CardDescription>Evolução mensal dos marcos de desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{tendenciasData.marcos.previsaoProximo}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Marcos Previstos Próximo Mês</div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-600">Tendência crescente</span>
              </div>
            </div>

            <div className="flex items-end justify-between h-16 border-b border-l border-gray-300 dark:border-gray-600">
              {tendenciasData.marcos.alcancadosMes.map((marcos, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-purple-500 rounded-t transition-all duration-300"
                    style={{ height: `${(marcos / 6) * 64}px`, minHeight: "4px" }}
                  ></div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{meses[index]}</div>
                </div>
              ))}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 bg-green-500 rounded-t transition-all duration-300 opacity-70"
                  style={{ height: `${(tendenciasData.marcos.previsaoProximo / 6) * 64}px`, minHeight: "4px" }}
                ></div>
                <div className="mt-1 text-xs text-green-600">Prev</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projeções e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Projeções e Recomendações</CardTitle>
          <CardDescription>Insights baseados nas tendências identificadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Tendência Positiva Geral</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Todas as categorias mostram tendência de crescimento. Mantenha as estratégias atuais e considere
                    expandir os programas de maior sucesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Projeção para Próximo Trimestre</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Com base nas tendências atuais, esperamos alcançar 18-20 marcos adicionais e um crescimento médio de
                    25% em todas as categorias.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-2">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Foco na Área Social</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    A categoria Social apresenta crescimento mais lento. Recomenda-se intensificar as atividades de
                    interação social e trabalho em grupo.
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
