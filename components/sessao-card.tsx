"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Calendar, Target, FileText, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import type { Sessao } from "@/lib/supabase"
import { formatDateTime } from "@/lib/utils"

interface SessaoCardProps {
  sessao: Sessao
  onEdit?: (sessao: Sessao) => void
  onDelete?: (sessaoId: string) => void
  onView?: (sessao: Sessao) => void
}

export function SessaoCard({ sessao, onEdit, onDelete, onView }: SessaoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "realizada":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelada":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "agendada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "realizada":
        return "Realizada"
      case "cancelada":
        return "Cancelada"
      case "agendada":
        return "Agendada"
      default:
        return status
    }
  }

  const isEditable = () => {
    // Sessões agendadas e realizadas podem ser editadas
    return sessao.status === "agendada" || sessao.status === "realizada"
  }

  const isDeletable = () => {
    // Apenas sessões agendadas podem ser excluídas
    return sessao.status === "agendada"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Sessão de {formatDateTime(sessao.data_sessao)}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(sessao.status)}>{getStatusText(sessao.status)}</Badge>
            {(onEdit || onDelete || onView) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(sessao)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                  )}
                  {onEdit && isEditable() && (
                    <DropdownMenuItem onClick={() => onEdit(sessao)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {onDelete && isDeletable() && (
                    <DropdownMenuItem onClick={() => onDelete(sessao.id)} className="text-red-600 dark:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDateTime(sessao.data_sessao)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {sessao.duracao} minutos
          </div>
        </div>

        {sessao.objetivos && (
          <div>
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              <h4 className="font-medium">Objetivos</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 line-clamp-2">{sessao.objetivos}</p>
          </div>
        )}

        {sessao.observacoes && (
          <div>
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2 text-green-600" />
              <h4 className="font-medium">Observações</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 line-clamp-2">{sessao.observacoes}</p>
          </div>
        )}

        {sessao.resultados && (
          <div>
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 mr-2 text-purple-600" />
              <h4 className="font-medium">Resultados</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 line-clamp-2">{sessao.resultados}</p>
          </div>
        )}

        {sessao.status === "agendada" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Esta sessão está agendada. Após a realização, edite para adicionar observações e resultados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
