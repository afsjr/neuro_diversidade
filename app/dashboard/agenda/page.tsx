"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { AgendaCalendar } from "@/components/agenda/agenda-calendar"
import { NovoAgendamentoForm } from "@/components/agenda/novo-agendamento-form"
import { AgendamentoCard } from "@/components/agenda/agendamento-card"
import { useAuth } from "@/contexts/auth-context"
import { getAgendamentos, createAgendamento, deleteAgendamento, type Agendamento } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function AgendaPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    if (user) {
      loadAgendamentos()
    }
  }, [user])

  const loadAgendamentos = async () => {
    try {
      if (!user) return
      setLoading(true)
      const { data, error } = await getAgendamentos(user.id)
      if (error) throw error
      setAgendamentos(data || [])
    } catch (err: any) {
      console.error("Erro ao carregar agenda:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAgendamento = async (novoData: any) => {
    try {
      if (!user) return
      const { data, error } = await createAgendamento({
        ...novoData,
        usuario_id: user.id
      })

      if (error) throw error
      
      toast({ title: "Sucesso", description: "Agendamento realizado!" })
      loadAgendamentos()
      setShowForm(false)
    } catch (err: any) {
      toast({ 
        title: "Erro", 
        description: err.message || "Não foi possível agendar.",
        variant: "destructive"
      })
    }
  }

  const agendamentosHoje = agendamentos.filter((a) => a.data === new Date().toISOString().split("T")[0])

  const proximosAgendamentos = [...agendamentos]
    .filter((a) => new Date(a.data) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.data + " " + a.hora).getTime() - new Date(b.data + " " + b.hora).getTime())
    .slice(0, 5)

  if (loading && agendamentos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus agendamentos e compromissos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{agendamentosHoje.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hoje</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {agendamentos.filter((a) => a.status === "confirmado" || a.status === "realizado").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Confirmados/Realizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {agendamentos.filter((a) => a.status === "agendado").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{agendamentos.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <AgendaCalendar agendamentos={agendamentos} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </CardContent>
          </Card>
        </div>

        {/* Próximos Agendamentos */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Seus compromissos mais próximos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proximosAgendamentos.length > 0 ? (
                proximosAgendamentos.map((agendamento) => (
                  <AgendamentoCard 
                    key={agendamento.id} 
                    agendamento={agendamento} 
                    onDelete={handleDeleteAgendamento}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum agendamento próximo</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulário de Novo Agendamento */}
      {showForm && (
        <Card id="novo-agendamento-secao">
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
            <CardDescription>Agende uma nova consulta ou sessão</CardDescription>
          </CardHeader>
          <CardContent>
            <NovoAgendamentoForm 
              onSubmit={handleAddAgendamento} 
              onCancel={() => setShowForm(false)} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
