"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getMetricasByPaciente, type MetricaProgresso } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ProgressoTabProps {
  pacienteId: string
}

export function ProgressoTab({ pacienteId }: ProgressoTabProps) {
  const [categoria, setCategoria] = useState<string>("Comunicação")
  const [metricas, setMetricas] = useState<MetricaProgresso[]>([])
  const [todasMetricas, setTodasMetricas] = useState<MetricaProgresso[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadMetricas()
  }, [pacienteId])

  useEffect(() => {
    // Filtrar métricas pela categoria selecionada
    const metricasFiltradas = todasMetricas.filter((m) => m.categoria === categoria)
    setMetricas(metricasFiltradas)
  }, [categoria, todasMetricas])

  const loadMetricas = async () => {
    try {
      setLoading(true)
      const { data, error } = await getMetricasByPaciente(pacienteId)

      if (error) {
        throw new Error(error.message)
      }

      setTodasMetricas(data || [])
    } catch (error: any) {
      console.error("Erro ao carregar métricas:", error)
      toast({
        title: "Erro ao carregar progresso",
        description: error.message || "Não foi possível carregar as métricas de progresso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const categorias = ["Comunicação", "Social", "Motor", "Cognitivo", "Comportamental"]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Progresso do Paciente</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Visualize a evolução do paciente ao longo do tempo</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gráfico de Progresso</CardTitle>
            <div className="w-48">
              <Label htmlFor="categoria" className="sr-only">
                Categoria
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            {metricas.length > 0 ? (
              <div className="w-full h-full flex flex-col justify-end">
                <div className="flex items-end justify-around h-64 border-b border-l border-gray-300 dark:border-gray-600">
                  {metricas.map((metrica, index) => (
                    <div key={metrica.id} className="flex flex-col items-center">
                      <div
                        className="w-12 bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${(metrica.valor / 10) * 100}%`, minHeight: "4px" }}
                      ></div>
                      <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                        {new Date(metrica.data_registro).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-4 text-gray-500 dark:text-gray-400">
                  <div className="text-sm">0</div>
                  <div className="text-sm">5</div>
                  <div className="text-sm">10</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Nenhum dado disponível para esta categoria</p>
                <p className="text-sm mt-2">Registre sessões com avaliações para visualizar o progresso</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          {metricas.length > 0 ? (
            <div className="space-y-4">
              {metricas.map((metrica) => (
                <div key={metrica.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{new Date(metrica.data_registro).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{metrica.observacao}</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      Nível {metrica.valor}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Nenhuma avaliação registrada para esta categoria
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
