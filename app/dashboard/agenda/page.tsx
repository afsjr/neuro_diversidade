"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AgendaCalendar } from "@/components/agenda/agenda-calendar"
import { NovoAgendamentoForm } from "@/components/agenda/novo-agendamento-form"
import { AgendamentoCard } from "@/components/agenda/agendamento-card"

interface Agendamento {
  id: string
  paciente_id: string
  paciente_nome: string
  data: string
  hora: string
  duracao: number
  tipo: "consulta" | "sessao" | "avaliacao"
  status: "agendado" | "confirmado" | "realizado" | "cancelado"
  observacoes?: string
}

// Dados de exemplo
const agendamentosExemplo: Agendamento[] = [
  {
    id: "1",
    paciente_id: "1",
    paciente_nome: "Ana Silva",
    data: "2024-01-22",
    hora: "10:00",
    duracao: 60,
    tipo: "sessao",
    status: "agendado",
    observacoes: "Sessão de terapia comportamental",
  },
  {
    id: "2",
    paciente_id: "2",
    paciente_nome: "João Santos",
    data: "2024-01-22",
    hora: "14:00",
    duracao: 45,
    tipo: "consulta",
    status: "confirmado",
    observacoes: "Consulta de acompanhamento",
  },
  {
    id: "3",
    paciente_id: "3",
    paciente_nome: "Beatriz Costa",
    data: "2024-01-23",
    hora: "09:00",
    duracao: 90,
    tipo: "avaliacao",
    status: "agendado",
    observacoes: "Avaliação neuropsicológica inicial",
  },
]

export default function AgendaPage() {
  const [showForm, setShowForm] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosExemplo)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleAddAgendamento = (novoAgendamento: Omit<Agendamento, "id">) => {
    const agendamento: Agendamento = {
      ...novoAgendamento,
      id: Date.now().toString(),
    }
    setAgendamentos([...agendamentos, agendamento])
    setShowForm(false)
  }

  const agendamentosHoje = agendamentos.filter((a) => a.data === new Date().toISOString().split("T")[0])

  const proximosAgendamentos = agendamentos
    .filter((a) => new Date(a.data) >= new Date())
    .sort((a, b) => new Date(a.data + " " + a.hora).getTime() - new Date(b.data + " " + b.hora).getTime())
    .slice(0, 5)

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
              {agendamentos.filter((a) => a.status === "confirmado").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Confirmados</div>
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
                  <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
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
        <Card>
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
            <CardDescription>Agende uma nova consulta ou sessão</CardDescription>
          </CardHeader>
          <CardContent>
            <NovoAgendamentoForm onSubmit={handleAddAgendamento} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
