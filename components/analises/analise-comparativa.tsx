"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Award } from "lucide-react"

interface AnaliseComparativaProps {
  periodo: string
}

const dadosComparativos = [
  {
    categoria: "Comunicação",
    pacientes: [
      { nome: "Ana Silva", progresso: 70, melhoria: 20 },
      { nome: "João Santos", progresso: 80, melhoria: 10 },
      { nome: "Beatriz Costa", progresso: 60, melhoria: 25 },
    ],
    media: 70,
  },
  {
    categoria: "Social",
    pacientes: [
      { nome: "Ana Silva", progresso: 60, melhoria: 15 },
      { nome: "João Santos", progresso: 70, melhoria: 8 },
      { nome: "Beatriz Costa", progresso: 55, melhoria: 20 },
    ],
    media: 62,
  },
  {
    categoria: "Motor",
    pacientes: [
      { nome: "Ana Silva", progresso: 80, melhoria: 10 },
      { nome: "João Santos", progresso: 90, melhoria: 5 },
      { nome: "Beatriz Costa", progresso: 75, melhoria: 15 },
    ],
    media: 82,
  },
]

export function AnaliseComparativa({ periodo }: AnaliseComparativaProps) {
  const getMelhorPaciente = (categoria: any) => {
    return categoria.pacientes.reduce((melhor: any, atual: any) =>
      atual.progresso > melhor.progresso ? atual : melhor,
    )
  }

  const getMaiorMelhoria = (categoria: any) => {
    return categoria.pacientes.reduce((melhor: any, atual: any) => (atual.melhoria > melhor.melhoria ? atual : melhor))
  }

  return (
    <div className="space-y-6">
      {/* Resumo Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Comparativo</CardTitle>
          <CardDescription>Comparação de desempenho entre pacientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes Comparados</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">71%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Progresso Médio</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">14%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Melhoria Média</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparação por Categoria */}
      {dadosComparativos.map((categoria) => {
        const melhorPaciente = getMelhorPaciente(categoria)
        const maiorMelhoria = getMaiorMelhoria(categoria)

        return (
          <Card key={categoria.categoria}>
            <CardHeader>
              <CardTitle>{categoria.categoria}</CardTitle>
              <CardDescription>
                Média da categoria: {categoria.media}% | Melhor desempenho: {melhorPaciente.nome} (
                {melhorPaciente.progresso}%) | Maior melhoria: {maiorMelhoria.nome} (+{maiorMelhoria.melhoria}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoria.pacientes.map((paciente) => (
                  <div key={paciente.nome} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{paciente.nome}</span>
                        {paciente.progresso === melhorPaciente.progresso && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Melhor
                          </Badge>
                        )}
                        {paciente.melhoria === maiorMelhoria.melhoria && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            +Melhoria
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{paciente.progresso}%</span>
                        <span className="text-xs text-green-600">+{paciente.melhoria}%</span>
                      </div>
                    </div>
                    <Progress value={paciente.progresso} className="h-2" />
                  </div>
                ))}

                {/* Linha da Média */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Média da Categoria</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{categoria.media}%</span>
                  </div>
                  <Progress value={categoria.media} className="h-2 opacity-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Insights Comparativos */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Comparativos</CardTitle>
          <CardDescription>Análises baseadas na comparação entre pacientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200">Destaque Motor</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                A categoria Motor apresenta o melhor desempenho geral com 82% de média. João Santos lidera com 90% de
                progresso.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Maior Evolução</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Beatriz Costa apresentou a maior melhoria na área de Comunicação (+25%), demonstrando excelente resposta
                ao tratamento.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Área de Atenção</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                A categoria Social apresenta a menor média (62%). Considere revisar as estratégias de intervenção social
                para todos os pacientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
