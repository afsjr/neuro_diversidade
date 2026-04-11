"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Target, Loader2 } from "lucide-react"
import { getPlanosByPaciente, getPacienteById, type PlanoTratamento, type Paciente } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { NovoPlanoForm } from "@/components/forms/novo-plano-form"

interface PlanosTratamentoTabProps {
  pacienteId: string
}

export function PlanosTratamentoTab({ pacienteId }: PlanosTratamentoTabProps) {
  const [planos, setPlanos] = useState<PlanoTratamento[]>([])
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [pacienteId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [planosRes, pacienteRes] = await Promise.all([
        getPlanosByPaciente(pacienteId),
        getPacienteById(pacienteId)
      ])

      if (planosRes.error) throw new Error(planosRes.error.message)
      if (pacienteRes.error) throw new Error(pacienteRes.error.message)

      setPlanos(planosRes.data || [])
      setPaciente(pacienteRes.data)
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Não foi possível carregar as informações",
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
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        )}
      </div>

      {showForm && paciente && (
        <Card>
          <CardContent className="pt-6">
            <NovoPlanoForm 
              paciente={paciente} 
              onSuccess={() => {
                setShowForm(false)
                loadData()
              }} 
              onCancel={() => setShowForm(false)} 
            />
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
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{plano.descricao}</p>
              </CardContent>
            </Card>
          ))
        ) : !showForm ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Nenhum plano de tratamento cadastrado</p>
              <Button variant="outline" onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
