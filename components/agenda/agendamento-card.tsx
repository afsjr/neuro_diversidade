import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar } from "lucide-react"

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

interface AgendamentoCardProps {
  agendamento: Agendamento
}

export function AgendamentoCard({ agendamento }: AgendamentoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "agendado":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "realizado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case "consulta":
        return "Consulta"
      case "sessao":
        return "Sessão"
      case "avaliacao":
        return "Avaliação"
      default:
        return tipo
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">{agendamento.paciente_nome}</span>
          </div>
          <Badge className={getStatusColor(agendamento.status)} variant="secondary">
            {agendamento.status}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(agendamento.data).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>
              {agendamento.hora} ({agendamento.duracao}min)
            </span>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {getTipoText(agendamento.tipo)}
          </span>
        </div>

        {agendamento.observacoes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{agendamento.observacoes}</p>
        )}
      </CardContent>
    </Card>
  )
}
