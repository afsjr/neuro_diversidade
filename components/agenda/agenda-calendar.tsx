"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface AgendaCalendarProps {
  agendamentos: Agendamento[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function AgendaCalendar({ agendamentos, selectedDate, onDateSelect }: AgendaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getAgendamentosForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return agendamentos.filter((a) => a.data === dateStr)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="space-y-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}

        {/* Dias vazios do início do mês */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={index} className="p-2"></div>
        ))}

        {/* Dias do mês */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const agendamentosDay = getAgendamentosForDate(day)

          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={`
                p-2 text-sm rounded-lg transition-colors relative
                ${isToday(day) ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : ""}
                ${isSelected(day) ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                ${agendamentosDay.length > 0 ? "font-semibold" : ""}
              `}
            >
              {day}
              {agendamentosDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
