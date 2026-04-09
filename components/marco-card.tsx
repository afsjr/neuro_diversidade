import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import type { MarcoDesenvolvimento } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"

interface MarcoCardProps {
  marco: MarcoDesenvolvimento
}

export function MarcoCard({ marco }: MarcoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "alcancado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "em_progresso":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pendente":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "alcancado":
        return "Alcançado"
      case "em_progresso":
        return "Em Progresso"
      case "pendente":
        return "Pendente"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "alcancado":
        return <CheckCircle className="h-4 w-4" />
      case "em_progresso":
        return <Clock className="h-4 w-4" />
      case "pendente":
        return <Calendar className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            {getStatusIcon(marco.status)}
            <span className="ml-2">{marco.titulo}</span>
          </CardTitle>
          <Badge className={getStatusColor(marco.status)}>{getStatusText(marco.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {marco.descricao && <p className="text-sm text-gray-600 dark:text-gray-400">{marco.descricao}</p>}

        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          {marco.data_alcancado && (
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              Alcançado em {formatDate(marco.data_alcancado)}
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Criado em {formatDate(marco.criado_em)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
