"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react"

interface FinanceiroData {
  mes: string
  receita: number
  sessoes: number
  valorMedio: number
}

const financeiroExemplo: FinanceiroData[] = [
  { mes: "2024-01", receita: 4800, sessoes: 24, valorMedio: 200 },
  { mes: "2023-12", receita: 4200, sessoes: 21, valorMedio: 200 },
  { mes: "2023-11", receita: 5000, sessoes: 25, valorMedio: 200 },
]

export function RelatorioFinanceiro() {
  const receitaTotal = financeiroExemplo.reduce((acc, f) => acc + f.receita, 0)
  const sessoesTotal = financeiroExemplo.reduce((acc, f) => acc + f.sessoes, 0)
  const valorMedio = receitaTotal / sessoesTotal
  const crescimento =
    financeiroExemplo.length > 1
      ? ((financeiroExemplo[0].receita - financeiroExemplo[1].receita) / financeiroExemplo[1].receita) * 100
      : 0

  return (
    <div className="space-y-6">
      {/* Estatísticas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {financeiroExemplo[0]?.receita.toLocaleString("pt-BR")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Receita do Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {crescimento >= 0 ? "+" : ""}
                  {crescimento.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Crescimento</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{financeiroExemplo[0]?.sessoes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessões do Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">R$ {valorMedio.toFixed(0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Valor Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Receita</CardTitle>
          <CardDescription>Receita mensal dos últimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeiroExemplo.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {new Date(item.mes + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </span>
                  <div className="text-right">
                    <div className="font-semibold">R$ {item.receita.toLocaleString("pt-BR")}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.sessoes} sessões</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(item.receita / Math.max(...financeiroExemplo.map((f) => f.receita))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Tipo de Sessão */}
      <Card>
        <CardHeader>
          <CardTitle>Receita por Tipo de Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">R$ 2.400</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessões de Terapia</div>
              <div className="text-xs text-gray-500">12 sessões</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">R$ 1.800</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Consultas</div>
              <div className="text-xs text-gray-500">9 consultas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">R$ 600</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avaliações</div>
              <div className="text-xs text-gray-500">3 avaliações</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
