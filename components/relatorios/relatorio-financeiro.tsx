"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Calendar, CreditCard, Loader2 } from "lucide-react"
import { getSessoesByUser } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface SessaoFinanceira {
  id: string
  data_sessao: string
  duracao: number
}

export function RelatorioFinanceiro() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sessoes, setSessoes] = useState<SessaoFinanceira[]>([])
  const VALOR_SESSAO_PADRAO = 200

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await getSessoesByUser(user.id)
      if (error) throw error
      setSessoes(data || [])
    } catch (err) {
      console.error("Erro ao carregar dados financeiros:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const sessoesAgrupadas = sessoes.reduce((acc: any, curr) => {
    const mes = curr.data_sessao.substring(0, 7) // YYYY-MM
    if (!acc[mes]) acc[mes] = { sessoes: 0, receita: 0 }
    acc[mes].sessoes += 1
    acc[mes].receita += VALOR_SESSAO_PADRAO
    return acc
  }, {})

  const historico = Object.keys(sessoesAgrupadas)
    .sort((a, b) => b.localeCompare(a))
    .map(mes => ({
      mes,
      ...sessoesAgrupadas[mes]
    }))

  const receitaAtual = historico.length > 0 ? historico[0].receita : 0
  const receitaAnterior = historico.length > 1 ? historico[1].receita : 0
  const crescimento = receitaAnterior > 0 
    ? ((receitaAtual - receitaAnterior) / receitaAnterior) * 100 
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {receitaAtual.toLocaleString("pt-BR")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Receita Estimada</div>
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
                <div className="text-2xl font-bold text-purple-600">
                  {historico.length > 0 ? historico[0].sessoes : 0}
                </div>
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
                <div className="text-2xl font-bold text-orange-600">R$ {VALOR_SESSAO_PADRAO}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Valor Estimado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Receita Estimada</CardTitle>
          <CardDescription>Baseado em R$ {VALOR_SESSAO_PADRAO} por sessão realizada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historico.length > 0 ? (
              historico.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {new Date(item.mes + "-02").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">R$ {item.receita.toLocaleString("pt-BR")}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{item.sessoes} sessões</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(item.receita / Math.max(...historico.map((f) => f.receita))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhum dado financeiro disponível.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
