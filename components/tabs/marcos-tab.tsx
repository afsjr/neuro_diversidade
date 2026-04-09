"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { MarcoForm } from "@/components/forms/marco-form"
import { MarcoCard } from "@/components/marco-card"
import { getMarcosByPaciente, createMarco, type MarcoDesenvolvimento } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface MarcosTabProps {
  pacienteId: string
}

export function MarcosTab({ pacienteId }: MarcosTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [marcos, setMarcos] = useState<MarcoDesenvolvimento[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadMarcos()
  }, [pacienteId])

  const loadMarcos = async () => {
    try {
      setLoading(true)
      const { data, error } = await getMarcosByPaciente(pacienteId)

      if (error) {
        throw new Error(error.message)
      }

      setMarcos(data || [])
    } catch (error: any) {
      console.error("Erro ao carregar marcos:", error)
      toast({
        title: "Erro ao carregar marcos",
        description: error.message || "Não foi possível carregar os marcos de desenvolvimento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddMarco = async (novoMarco: Omit<MarcoDesenvolvimento, "id" | "criado_em" | "atualizado_em">) => {
    try {
      const { data, error } = await createMarco(novoMarco)

      if (error) {
        throw new Error(error.message)
      }

      if (data) {
        setMarcos([data, ...marcos])
        setShowForm(false)
        toast({
          title: "Marco criado",
          description: "Marco de desenvolvimento criado com sucesso",
        })
      }
    } catch (error: any) {
      console.error("Erro ao criar marco:", error)
      toast({
        title: "Erro ao criar marco",
        description: error.message || "Não foi possível criar o marco de desenvolvimento",
        variant: "destructive",
      })
    }
  }

  const categorias = ["Comunicação", "Social", "Motor", "Cognitivo", "Comportamental"]
  const marcosPorCategoria = categorias.map((categoria) => ({
    categoria,
    marcos: marcos.filter((marco) => marco.categoria === categoria),
  }))

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
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
          <h3 className="text-lg font-medium">Marcos de Desenvolvimento</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe o progresso e conquistas do paciente</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Marco
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Marco de Desenvolvimento</CardTitle>
            <CardDescription>Defina um novo objetivo ou registre uma conquista</CardDescription>
          </CardHeader>
          <CardContent>
            <MarcoForm pacienteId={pacienteId} onSubmit={handleAddMarco} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {marcosPorCategoria.map(({ categoria, marcos: marcosCategoria }) => (
          <div key={categoria}>
            <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{categoria}</h4>
            {marcosCategoria.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marcosCategoria.map((marco) => (
                  <MarcoCard key={marco.id} marco={marco} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum marco definido para esta categoria</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
