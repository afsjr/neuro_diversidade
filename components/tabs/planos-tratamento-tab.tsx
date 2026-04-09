"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Target } from "lucide-react"
import { getPlanosByPaciente, type PlanoTratamento } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface PlanosTratamentoTabProps {
  pacienteId: string
}

export function PlanosTratamentoTab({ pacienteId }: PlanosTratamentoTabProps) {
  const [planos, setPlanos] = useState<PlanoTratamento[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadPlanos()
  }, [pacienteId])

  const loadPlanos = async () => {
    try {
      setLoading(true)
      const { data, error } = await getPlanosByPaciente(pacienteId)

      if (error) {
        throw new Error(error.message)
      }

      setPlanos(data || [])
    } catch (error: any) {
      console.error("Erro ao carregar planos:", error)
      toast({
        title: "Erro ao carregar planos",
        description: error.message || "Não foi possível carregar os planos de tratamento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "concluido":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pausado":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo"
      case "concluido":
        return "Concluído"
      case "pausado":
        return "Pausado"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Planos de Tratamento</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie os planos terapêuticos do paciente</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Plano de Tratamento</CardTitle>
            <CardDescription>Crie um novo plano terapêutico para o paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Formulário de criação de plano em desenvolvimento</p>
              <Button variant="outline" onClick={() => setShowForm(false)} className="mt-4">
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {planos.length > 0 ? (
          planos.map((plano) => (
            <Card key={plano.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                    {plano.titulo}
                  </CardTitle>
                  <Badge className={getStatusColor(plano.status)}>{getStatusText(plano.status)}</Badge>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(plano.data_inicio).toLocaleDateString("pt-BR")} até{" "}
                  {plano.data_fim ? new Date(plano.data_fim).toLocaleDateString("pt-BR") : "Indefinido"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{plano.descricao}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Nenhum plano de tratamento cadastrado</p>
              <Button variant="outline" onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
